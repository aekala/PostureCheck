import React, { useEffect, useState } from "react";
import { NotificationData } from "./notificationData";
import { Container, Alert, Button, Form } from "react-bootstrap";

export default function Options() {
	const [options, setOptions] = useState(new NotificationData());
	const [showAlarmCreationAlert, setShowAlarmCreationAlert] = useState(false);
	const [alarmCreationProps, setAlarmCreationProps] = useState({
		variant: "success",
		message: "Alarm Created Successfully!",
	});
	const [validated, setValidated] = useState(false);

	useEffect(() => {
		getStoredNotificationData().then((data) => {
			setOptions({
				...data,
				pauseStatus: {
					isPaused: false,
					timeRemaining: 0,
				},
			});
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
		if (e.target.value != NaN) {
			const interval: number = parseInt(e.target.value);
			setOptions({
				...options,
				interval: interval,
			});
		}
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
		e.stopPropagation();
		const form = e.currentTarget;
		if (form.checkValidity()) {
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

		setValidated(true);
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

			<Form onSubmit={handleSubmit} noValidate validated={validated}>
				<Form.Group className='mb-3' controlId='formNotificationTitle'>
					<Form.Label htmlFor='title'>Title</Form.Label>
					<Form.Control
						type='text'
						id='title'
						name='title'
						value={options.title}
						onChange={updateTitle}
						minLength={1}
						maxLength={50}
						required
					/>
					<Form.Control.Feedback type='invalid'>
						Please enter a title between 1 and 50 characters
					</Form.Control.Feedback>
				</Form.Group>
				<Form.Group className='mb-3' controlId='formNotificationMessage'>
					<Form.Label htmlFor='message'>Message</Form.Label>
					<Form.Control
						type='text'
						id='message'
						name='message'
						value={options.message}
						onChange={updateMessage}
						minLength={1}
						maxLength={50}
						required
					/>
					<Form.Control.Feedback type='invalid'>
						Please enter a message between 1 and 50 characters
					</Form.Control.Feedback>
				</Form.Group>
				<Form.Group className='mb-3' controlId='formNotificationInterval'>
					<Form.Label htmlFor='interval'>
						Time Between Alerts (minutes)
					</Form.Label>
					<Form.Control
						type='number'
						id='interval'
						name='interval'
						value={options.interval}
						onChange={updateInterval}
						min={1}
						max={160}
						step='1'
						autoComplete='off'
						required
					/>
					<Form.Control.Feedback type='invalid'>
						Please enter a number between 1-60.
					</Form.Control.Feedback>
				</Form.Group>
				<Form.Group className='mb-3' controlId='formNotificationSilent'>
					<Form.Check
						type='switch'
						id='silent'
						name='silent'
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
