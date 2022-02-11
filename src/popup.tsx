import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

function Popup() {
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

	let timeDisplay = "Loading...";
	if (isAlarmRunning) {
		if (secondsUntilAlarm != null) {
			timeDisplay = getTimeDisplay();
		}
	} else {
		timeDisplay = "No Alarm Currently Set";
	}

	return (
		<>
			<p>POPUP TBD</p>
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
