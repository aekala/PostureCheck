import React, { useEffect, useState } from "react";
import { NotificationData } from "./notificationData";
import { Container, Alert, Button } from "react-bootstrap";

export default function Options() {
	const [notificationData, setNotificationData] = useState(
		new NotificationData()
	);
	const [showAlarmCreationAlert, setShowAlarmCreationAlert] = useState(false);
	const [alarmCreationProps, setAlarmCreationProps] = useState({
		variant: "success",
		message: "Alarm Created Successfully!",
	});

	useEffect(() => {
		getStoredNotificationData().then((data) => {
			setNotificationData(data);
		});
	}, []);

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

	function updateNotificationTitle(e) {
		const title: string = e.target.value;
		if (title.length > 0) {
			chrome.storage.local.set({
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
			chrome.storage.local.set({
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
			chrome.storage.local.set({
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
			chrome.storage.local.set({
				notificationData: { ...notificationData, silent: checked },
			});

			setNotificationData(
				new NotificationData({ ...notificationData, silent: checked })
			);
		}
	}

	function handleSubmit(e) {
		e.preventDefault();
		chrome.storage.local.get("notificationData", ({ notificationData }) => {
			if (chrome.runtime.lastError) {
				return chrome.runtime.lastError;
			}
			chrome.runtime.sendMessage(
				{
					request: "updateAlarm",
					notificationData,
				},
				(response) => {
					const alarmResultObj = response.alarmCreationSuccess
						? { variant: "success", message: "Alarm Created Successfully" }
						: { variant: "danger", message: "Alarm was unable to be created" };
					setShowAlarmCreationAlert(true);
					setAlarmCreationProps(alarmResultObj);
				}
			);
		});
	}

	return (
		<Container fluid>
			{showAlarmCreationAlert && (
				<Alert
					variant={alarmCreationProps.variant}
					onClose={() => setShowAlarmCreationAlert(false)}
					dismissible
				>
					{alarmCreationProps.message}
				</Alert>
			)}
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
				<Button variant='outline-primary' type='submit'>
					Set Alarm
				</Button>
			</form>
		</Container>
	);
}
