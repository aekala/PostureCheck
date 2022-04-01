import React, { useEffect, useRef, useState } from "react";
import { NotificationData } from "./notificationData";
import { Container, Row, Col, Button } from "react-bootstrap";

export default function HomePage(props) {
	const [data, setData] = useState(null);
	const [isAlarmRunning, setIsAlarmRunning] = useState(false);
	const [isAlarmPaused, setIsAlarmPaused] = useState(false);
	const [secondsUntilAlarm, setSecondsUntilAlarm] = useState(null);
	const isInitialMount = useRef(true);
	const timeDisplayLoadingMessage = "Loading Time...";

	function getTimeUntilNextNotification(): Promise<number> {
		return new Promise((resolve, reject) => {
			chrome.alarms.get("PostureCheck", (alarm) => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				}
				let timeUntilAlarm = null;
				if (alarm != null) {
					setIsAlarmRunning(true);
					timeUntilAlarm = Math.floor(
						(alarm.scheduledTime - Date.now()) / 1000
					);
				} else {
					setIsAlarmRunning(false);
				}
				resolve(timeUntilAlarm);
			});
		});
	}

	useEffect(() => {
		let timer = setInterval(() => {
			getTimeUntilNextNotification().then((time) => {
				if (time != null) {
					setSecondsUntilAlarm(time);
				}
			});
		}, 100);

		return () => {
			clearInterval(timer);
		};
	}, []);

	useEffect(() => {
		if (isInitialMount.current) {
			updateNotificationDataStateFromStorage();
			isInitialMount.current = false;
		}
	});

	function getStoredNotificationData(): Promise<NotificationData> {
		return new Promise((resolve, reject) => {
			chrome.storage.local.get("notificationData", ({ notificationData }) => {
				if (chrome.runtime.lastError) {
					return reject(chrome.runtime.lastError);
				}
				resolve(notificationData);
			});
		});
	}

	function updateNotificationDataStateFromStorage() {
		getStoredNotificationData().then((notificationData: NotificationData) => {
			setData(notificationData);
			setIsAlarmPaused(notificationData.pauseStatus.isPaused);
		});
	}

	function getTimeDisplay(): string {
		const ISOTimeUntilAlarm = new Date(secondsUntilAlarm * 1000).toISOString();
		let timeDisplay: string = props.timeDisplay;

		if (secondsUntilAlarm != null) {
			if (secondsUntilAlarm >= 3600) {
				// use HH:MM::SS format if one hour or more is left on timer
				timeDisplay = ISOTimeUntilAlarm.substring(11, 19);
			} else {
				// if under 1 hour left use MM:SS format
				timeDisplay = ISOTimeUntilAlarm.substring(14, 19);
			}
			props.setTimeDisplay(timeDisplay);
		}
		return timeDisplay;
	}

	function handleAlarmToggleRequest() {
		chrome.storage.local.get("notificationData", ({ notificationData }) => {
			if (chrome.runtime.lastError) {
				return chrome.runtime.lastError;
			}
			let message = {
				notificationData: notificationData,
				request: null,
				timeRemaining: 0,
			};
			if (isAlarmPaused) {
				message.request = "resumeAlarm";
			} else {
				message.request = "pauseAlarm";
				message.timeRemaining = secondsUntilAlarm;
			}
			sendMessage(message);
		});
	}

	function handleAlarmCancelRequest() {
		const message = {
			notificationData: data,
			request: "cancelAlarm",
		};
		props.setTimeDisplay(null);
		setIsAlarmRunning(false);
		setSecondsUntilAlarm(null);
		sendMessage(message);
	}

	function sendMessage(message) {
		chrome.runtime.sendMessage(message, updateNotificationDataStateFromStorage);
	}

	let timeDisplay: string = timeDisplayLoadingMessage;
	if (isAlarmRunning) {
		if (secondsUntilAlarm != null) {
			timeDisplay = getTimeDisplay();
		}
	} else if (isAlarmPaused) {
		timeDisplay = getTimeDisplay();
	} else {
		timeDisplay = props.timeDisplay
			? props.timeDisplay
			: `No Alarm Currently Set`;
	}

	const toggleDisplay = isAlarmPaused ? "Resume" : "Pause";

	const isAlarmSet =
		isAlarmRunning ||
		isAlarmPaused ||
		(props.timeDisplay && timeDisplay != timeDisplayLoadingMessage);

	let timerLabel: string = "";
	if (isAlarmSet) {
		timerLabel = isAlarmRunning ? "Time Until Alarm" : "Paused";
	}

	return (
		<Container fluid className='homepageContainer'>
			<Row>
				<Col>
					<div className='timerLabel'>{timerLabel}</div>
				</Col>
			</Row>
			<Row>
				<Col />
				<Col>
					<div className='timerContainer'>
						<div
							className={
								"timer " +
								(isAlarmSet && "timerSet ") +
								(isAlarmPaused && "timerPaused")
							}
						>
							{timeDisplay}
						</div>
					</div>
				</Col>
				<Col />
			</Row>
			<div className='buttonsContainer'>
				{!isAlarmSet && (
					<Row>
						<Col>
							<Button
								variant='outline-primary'
								onClick={props.changeViewToOptionsPage}
								className='button'
							>
								Create Alarm
							</Button>
						</Col>
					</Row>
				)}
				{isAlarmSet && (
					<Row>
						<Col>
							<Button
								variant='outline-primary'
								onClick={handleAlarmToggleRequest}
								className='button'
							>
								{toggleDisplay}
							</Button>
						</Col>
						<Col>
							<Button
								variant='outline-primary'
								onClick={handleAlarmCancelRequest}
								className='button'
							>
								Cancel
							</Button>
						</Col>
					</Row>
				)}
			</div>
		</Container>
	);
}
