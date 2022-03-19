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
				setSecondsUntilAlarm(time);
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
		let timeDisplay: string = "";

		if (secondsUntilAlarm >= 3600) {
			// use HH:MM::SS format if one hour or more is left on timer
			timeDisplay = ISOTimeUntilAlarm.substring(11, 19);
		} else {
			// if under 1 hour left use MM:SS format
			timeDisplay = ISOTimeUntilAlarm.substring(14, 19);
		}
		props.setTimeDisplay(timeDisplay);
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

	let timeDisplay: string = timeDisplayLoadingMessage;
	if (isAlarmRunning) {
		if (secondsUntilAlarm != null) {
			timeDisplay = getTimeDisplay();
		}
	} else if (isAlarmPaused) {
		timeDisplay = new Date(data.pauseStatus.timeRemaining * 1000)
			.toISOString()
			.substring(14, 19);
	} else {
		timeDisplay = props.timeDisplay
			? props.timeDisplay
			: `No Alarm Currently Set`;
	}

	let toggleDisplay: string = "";
	if (isAlarmPaused) {
		toggleDisplay = "Resume";
	} else {
		toggleDisplay = "Pause";
	}

	function handleAlarmCancelRequest() {
		let message = {
			notificationData: data,
			request: "cancelAlarm",
		};
		props.setTimeDisplay(null);
		setIsAlarmRunning(false);
		sendMessage(message);
	}

	function sendMessage(message) {
		chrome.runtime.sendMessage(message, updateNotificationDataStateFromStorage);
	}

	const isAlarmSet =
		isAlarmRunning ||
		isAlarmPaused ||
		(props.timeDisplay && timeDisplay != timeDisplayLoadingMessage);

	return (
		<Container fluid className='homepageContainer'>
			<Row>
				<Col>
					<div className='timerLabel'>
						{isAlarmSet && <span>Time Until Alarm</span>}
					</div>
				</Col>
			</Row>
			<Row>
				<Col />
				<Col>
					<div className='timerContainer'>
						<div className={"timer " + (isAlarmSet && "timerActive")}>
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
