import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

function Popup() {
	const [secondsUntilAlarm, setSecondsUntilAlarm] = useState(0);

	setTimeUntilNextAlarm();

	function setTimeUntilNextAlarm() {
		getNotificationAlarm().then((alarm) => {
			if (alarm) {
				let timeUntilAlarm = Math.floor(
					(alarm.scheduledTime - Date.now()) / 1000
				);
				if (timeUntilAlarm <= 0) {
					timeUntilAlarm = 0;
				}
				setSecondsUntilAlarm(timeUntilAlarm);
			}
		});
	}

	useEffect(() => {
		let timer = setInterval(() => {
			setTimeUntilNextAlarm();
		}, 1000);
	}, []);

	function getNotificationAlarm(): Promise<chrome.alarms.Alarm> {
		return new Promise((resolve, reject) => {
			chrome.alarms.get("PostureCheck", (alarm) => {
				console.log(alarm);
				if (chrome.runtime.lastError) {
					return reject(chrome.runtime.lastError);
				}
				resolve(alarm);
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

	return (
		<>
			<p>POPUP TBD</p>
			<p>{getTimeDisplay()}</p>
		</>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>,
	document.getElementById("root")
);
