import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { NotificationData } from "./notificationData";

function Popup() {
	const [notificationData, setNotificationData] = useState(null);
	const [isAlarmRunning, setIsAlarmRunning] = useState(true);
	const [isAlarmPaused, setIsAlarmPaused] = useState(false);
	const [secondsUntilAlarm, setSecondsUntilAlarm] = useState(null);
	const isInitialMount = useRef(true);

	function getTimeUntilNextNotification(): Promise<number> {
		return new Promise((resolve, reject) => {
			chrome.alarms.get("PostureCheck", (alarm) => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				}
				let timeUntilAlarm = null;
				if (alarm != null) {
					setIsAlarmRunning(true);
					timeUntilAlarm = Math.ceil((alarm.scheduledTime - Date.now()) / 1000);
					if (timeUntilAlarm < 0) {
						timeUntilAlarm = 0;
					}
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
		getStoredNotificationData().then((data: NotificationData) => {
			setNotificationData(data);
			setIsAlarmPaused(data.pauseStatus.isPaused);
		});
	}

	function getTimeDisplay(): string {
		const ISOTimeUntilAlarm = new Date(secondsUntilAlarm * 1000).toISOString();
		if (secondsUntilAlarm >= 3600) {
			// use HH:MM::SS format if one hour or more is left on timer
			return ISOTimeUntilAlarm.substring(11, 19);
		} else {
			// if under 1 hour left use MM:SS format
			return ISOTimeUntilAlarm.substring(14, 19);
		}
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

	let timeDisplay = "Loading Time...";
	if (isAlarmRunning) {
		if (secondsUntilAlarm != null) {
			timeDisplay = getTimeDisplay();
		}
	} else if (isAlarmPaused) {
		timeDisplay = new Date(notificationData.pauseStatus.timeRemaining * 1000)
			.toISOString()
			.substring(14, 19);
	} else {
		timeDisplay = "No Alarm Currently Set";
	}

	let toggleDisplay = "";
	if (isAlarmPaused) {
		toggleDisplay = "Resume";
	} else {
		toggleDisplay = "Pause";
	}

	function handleAlarmCancelRequest() {
		let message = {
			notificationData: notificationData,
			request: "cancelAlarm",
		};
		sendMessage(message);
	}

	function handleExtensionResetRequest() {
		let message = {
			request: "resetExtension",
		};

		sendMessage(message);
	}

	function sendMessage(message) {
		chrome.runtime.sendMessage(message, updateNotificationDataStateFromStorage);
	}

	return (
		<>
			<p>POPUP TBD</p>
			<p>{timeDisplay}</p>
			{(isAlarmRunning || isAlarmPaused) && (
				<>
					<button onClick={handleAlarmToggleRequest}>{toggleDisplay}</button>
					<button onClick={handleAlarmCancelRequest}>Cancel Alarm</button>
				</>
			)}
			<button onClick={handleExtensionResetRequest}>Reset Extension</button>
		</>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>,
	document.getElementById("root")
);
