import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { NotificationData } from "./notificationData";

function Popup() {
	const [notificationData, setNotificationData] = useState(null);
	const [isAlarmRunning, setIsAlarmRunning] = useState(true);
	const [secondsUntilAlarm, setSecondsUntilAlarm] = useState(null);

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
		getStoredNotificationData().then((data) => {
			setNotificationData(data);
		});
	}, [notificationData]);

	function getStoredNotificationData(): Promise<NotificationData> {
		return new Promise((resolve, reject) => {
			chrome.storage.sync.get("notificationData", ({ notificationData }) => {
				if (chrome.runtime.lastError) {
					return reject(chrome.runtime.lastError);
				}
				resolve(notificationData);
			});
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

	let timeDisplay = "Loading Time...";
	if (isAlarmRunning) {
		if (secondsUntilAlarm != null) {
			timeDisplay = getTimeDisplay();
		}
	} else {
		timeDisplay = "No Alarm Currently Set";
	}

	let timesFiredDisplay = "Loading Times Fired...";
	if (notificationData != null) {
		timesFiredDisplay = `Times Fired: ${notificationData.timesFired}`;
	}

	return (
		<>
			<p>POPUP TBD</p>
			<p>{timesFiredDisplay}</p>
			<p>{timeDisplay}</p>
		</>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>,
	document.getElementById("root")
);
