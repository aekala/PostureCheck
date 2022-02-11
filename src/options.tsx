import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { NotificationData } from "./notificationData";

function Options() {
	const [notificationData, setNotificationData] = useState(
		new NotificationData()
	);

	useEffect(() => {
		getStoredNotificationData().then((data) => {
			setNotificationData(data);
		});
	}, []);

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

	function updateNotificationTitle(e) {
		const title: string = e.target.value;
		if (title.length > 0) {
			chrome.storage.sync.set({
				notificationData: { ...notificationData, title: title },
			});

			setNotificationData(
				new NotificationData({ ...notificationData, title: title })
			);
		}
	}

	function updateNotificationMessage(e) {
		const message: string = e.target.value;
		if (message.length > 0) {
			chrome.storage.sync.set({
				notificationData: { ...notificationData, message: message },
			});

			setNotificationData(
				new NotificationData({ ...notificationData, message: message })
			);
		}
	}

	function updateNotificationInterval(e) {
		const interval: number = parseInt(e.target.value);
		if (interval > 0) {
			chrome.storage.sync.set({
				notificationData: { ...notificationData, interval: interval },
			});

			setNotificationData(
				new NotificationData({ ...notificationData, interval: interval })
			);
		}
	}

	function updateNotificationSilent(e) {
		const checked = e.target.checked;
		if (checked != null) {
			chrome.storage.sync.set({
				notificationData: { ...notificationData, silent: checked },
			});

			setNotificationData(
				new NotificationData({ ...notificationData, silent: checked })
			);
		}
	}

	function handleSubmit(e) {
		e.preventDefault();
		chrome.runtime.sendMessage({
			request: "updateAlarm",
			notificationData,
		});
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<label htmlFor='title'>Title</label>
				<input
					type='text'
					id='title'
					name='title'
					value={notificationData.title}
					onChange={updateNotificationTitle}
				/>
				<label htmlFor='message'>Message</label>
				<input
					type='text'
					id='message'
					name='message'
					value={notificationData.message}
					onChange={updateNotificationMessage}
				/>
				<label htmlFor='interval'>Time Between Alerts (in minutes)</label>
				<input
					type='number'
					id='interval'
					name='interval'
					value={notificationData.interval}
					onChange={updateNotificationInterval}
				/>
				<label htmlFor='silent'>Silent Notifications</label>
				<input
					type='checkbox'
					id='silent'
					name='interval'
					checked={notificationData.silent}
					onChange={updateNotificationSilent}
				/>
				<input type='submit' value='Submit' />
			</form>
		</>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<Options />
	</React.StrictMode>,
	document.getElementById("root")
);
