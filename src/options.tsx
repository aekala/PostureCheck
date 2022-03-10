import React, { useEffect, useState } from "react";
import { NotificationData } from "./notificationData";
import { Container, Alert, Button, Form } from "react-bootstrap";

export default function Options() {
	const [notificationData, setNotificationData] = useState(
		new NotificationData()
	);
	const [showAlarmCreationAlert, setShowAlarmCreationAlert] = useState(false);
	const [alarmCreationProps, setAlarmCreationProps] = useState({
		variant: "success",
		message: "Alarm Created Successfully!",
	});

	//TODO: create state hook to keep track of changes to form (make it so it's not updating from chrome local storage every time)
	//TODO: add validation to form fields

	useEffect(() => {
		console.log("hi");
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

			<Form onSubmit={handleSubmit}>
				<Form.Group className='mb-3' controlId='formNotificationTitle'>
					<Form.Label htmlFor='title'>Title</Form.Label>
					<Form.Control
						type='text'
						id='title'
						name='title'
						value={notificationData.title}
						onChange={updateNotificationTitle}
					/>
				</Form.Group>
				<Form.Group className='mb-3' controlId='formNotificationMessage'>
					<Form.Label htmlFor='message'>Message</Form.Label>
					<Form.Control
						type='text'
						id='message'
						name='message'
						value={notificationData.message}
						onChange={updateNotificationMessage}
					/>
				</Form.Group>
				<Form.Group className='mb-3' controlId='formNotificationInterval'>
					<Form.Label htmlFor='interval'>
						Time Between Alerts (in minutes)
					</Form.Label>
					<Form.Control
						type='number'
						id='interval'
						name='interval'
						value={notificationData.interval}
						onChange={updateNotificationInterval}
					/>
				</Form.Group>
				<Form.Group className='mb-3' controlId='formNotificationSilent'>
					<Form.Check
						type='checkbox'
						id='silent'
						name='interval'
						label='Silent Notifications'
						checked={notificationData.silent}
						onChange={updateNotificationSilent}
					/>
				</Form.Group>
				<Button variant='outline-primary' type='submit' className='button'>
					Set Alarm
				</Button>
			</Form>
		</Container>
	);
}
