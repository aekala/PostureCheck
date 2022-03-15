import React, { useEffect, useState } from "react";
import { NotificationData } from "./notificationData";
import { Container, Alert, Button, Form } from "react-bootstrap";

export default function Options() {
	const [notificationData, setNotificationData] = useState(
		new NotificationData()
	);

	const [options, setOptions] = useState(new NotificationData());

	const [showAlarmCreationAlert, setShowAlarmCreationAlert] = useState(false);
	const [alarmCreationProps, setAlarmCreationProps] = useState({
		variant: "success",
		message: "Alarm Created Successfully!",
	});

	//TODO: maybe need to add save options button? play around to see what's most intuitive for a user
	//TODO: add validation to form fields

	useEffect(() => {
		getStoredNotificationData().then((data) => {
			setNotificationData(data);
			setOptions(data);
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

	function updateTitle(e) {
		const title: string = e.target.value;
		setOptions({ ...options, title: title });
	}

	function updateMessage(e) {
		const message: string = e.target.value;
		setOptions({
			...options,
			message: message,
		});
	}

	function updateInterval(e) {
		const interval: number = parseInt(e.target.value);
		setOptions({
			...options,
			interval: interval,
		});
	}

	function updateSilent(e) {
		const checked = e.target.checked;
		if (checked != null) {
			setOptions({
				...options,
				silent: checked,
			});
		}
	}

	function handleSubmit(e) {
		e.preventDefault();
		chrome.storage.local.set({ notificationData: options }, () => {
			if (chrome.runtime.lastError) {
				return chrome.runtime.lastError;
			}
			chrome.runtime.sendMessage(
				{
					request: "updateAlarm",
					notificationData: options,
				},
				(response) => {
					const alarmResultObj = response.alarmCreationSuccess
						? { variant: "success", message: "Alarm Created Successfully" }
						: {
								variant: "danger",
								message: "Alarm was unable to be created",
						  };
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
						value={options.title}
						onChange={updateTitle}
					/>
				</Form.Group>
				<Form.Group className='mb-3' controlId='formNotificationMessage'>
					<Form.Label htmlFor='message'>Message</Form.Label>
					<Form.Control
						type='text'
						id='message'
						name='message'
						value={options.message}
						onChange={updateMessage}
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
						value={options.interval}
						onChange={updateInterval}
					/>
				</Form.Group>
				<Form.Group className='mb-3' controlId='formNotificationSilent'>
					<Form.Check
						type='checkbox'
						id='silent'
						name='interval'
						label='Silent Notifications'
						checked={options.silent}
						onChange={updateSilent}
					/>
				</Form.Group>
				<Button variant='outline-primary' type='submit' className='button'>
					Set Alarm
				</Button>
			</Form>
		</Container>
	);
}
