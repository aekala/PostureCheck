import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { NotificationData } from "./notificationData";

function Popup() {
	const [notificationData, setNotificationData] = useState(
		new NotificationData()
	);

	getStoredNotificationData().then((data) => {
		setNotificationData(data);
	});

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

	function updateNotificationText(e) {
		const text: string = e.target.value;
		chrome.storage.sync.set({
			notificationData: { ...notificationData, message: text },
		});

		setNotificationData(
			new NotificationData({ ...notificationData, message: text })
		);
	}

	function handleSubmit() {
		chrome.runtime.sendMessage({
			request: "updateAlarm",
			notificationData,
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
						value={notificationData.message}
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
