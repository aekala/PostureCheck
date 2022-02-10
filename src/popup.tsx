import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

function Popup() {
	const [notificationText, setNotificationText] = useState("");
	// const [notificationData, setNotificationData] = useState({});
	getStoredNotificationText().then((text) => {
		setNotificationText(text);
	});

	function getStoredNotificationText(): Promise<string> {
		return new Promise((resolve, reject) => {
			chrome.storage.sync.get("notificationText", ({ notificationText }) => {
				if (chrome.runtime.lastError) {
					return reject(chrome.runtime.lastError);
				}
				resolve(notificationText);
			});
		});
	}

	function updateNotificationText(e) {
		const text = e.target.value;
		chrome.storage.sync.set({ notificationText: text });
		setNotificationText(text);
	}

	function handleSubmit() {
		chrome.runtime.sendMessage({
			request: "updateAlarm",
			alarmMessage: notificationText,
			alarmPeriodInMinutes: 0.1,
		});
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<label>
					Notification Message:
					<input
						type='text'
						value={notificationText}
						onChange={updateNotificationText}
					/>
				</label>
				<input type='submit' value='Submit' />
			</form>
		</>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>,
	document.getElementById("root")
);
