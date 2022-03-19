import { NotificationData } from "./notificationData";

let notificationData: NotificationData;

chrome.runtime.onInstalled.addListener(() => {
	initializeExtensionState();
});

function initializeExtensionState() {
	chrome.storage.local.clear();
	chrome.alarms.clearAll();
	chrome.notifications.clear("PostureNotification");
	const initialNotificationData: NotificationData = new NotificationData();
	chrome.storage.local.set({
		notificationData: initialNotificationData,
		computerState: "active",
	});
	chrome.idle.setDetectionInterval(300);
}

function eventListener(message, sender, sendResponse) {
	let result: any = {};
	switch (message.request) {
		case "updateAlarm":
			notificationData = message.notificationData;
			let alarmCreationSuccess = true;
			chrome.alarms.clearAll((wasCleared) => {
				if (!wasCleared) {
					console.error("Failed to clear all existing alarms");
					alarmCreationSuccess = false;
				}
				chrome.alarms.onAlarm.removeListener(alarmListener);
				if (chrome.alarms.onAlarm.hasListeners()) {
					console.error("Alarm still has active event listeners attached");
					alarmCreationSuccess = false;
				}
				chrome.alarms.create("PostureCheck", {
					periodInMinutes: notificationData.interval + 1 / 60.0,
				});
				chrome.alarms.onAlarm.addListener(alarmListener);
				if (!chrome.alarms.onAlarm.hasListener(alarmListener)) {
					console.error("Failed to attach event listener alarmListener");
					result.alarmCreationSuccess = false;
				}
			});
			result.alarmCreationSuccess = alarmCreationSuccess;
			break;
		case "pauseAlarm":
			notificationData = message.notificationData;
			let alarmPauseSuccess = true;
			chrome.alarms.clearAll((wasCleared) => {
				if (!wasCleared) {
					console.error("Failed to clear all existing alarms");
					alarmPauseSuccess = false;
				}
				chrome.alarms.onAlarm.removeListener(alarmListener);
				if (chrome.alarms.onAlarm.hasListeners()) {
					console.error("Alarm still has active event listeners attached");
					alarmPauseSuccess = false;
				}
			});
			const timeRemaining = message.timeRemaining;
			chrome.storage.local.set({
				notificationData: {
					...notificationData,
					pauseStatus: { isPaused: true, timeRemaining },
				},
			});
			result.alarmPauseSuccess = alarmPauseSuccess;
			break;
		case "resumeAlarm":
			notificationData = message.notificationData;
			let alarmResumeSuccess = true;
			chrome.alarms.create("PostureCheck", {
				periodInMinutes: notificationData.interval,
				delayInMinutes: (notificationData.pauseStatus.timeRemaining + 1) / 60.0,
			});
			chrome.alarms.onAlarm.addListener(alarmListener);
			if (!chrome.alarms.onAlarm.hasListener(alarmListener)) {
				console.error(
					"Failed to attach event listener alarmListener when resuming alarm"
				);
				alarmResumeSuccess = false;
			}
			chrome.storage.local.set({
				notificationData: {
					...notificationData,
					pauseStatus: { isPaused: false, timeRemaining: 0 },
				},
			});
			result.alarmResumeSuccess = alarmResumeSuccess;
			break;
		case "cancelAlarm":
			let alarmCancelSuccess = true;
			chrome.alarms.clearAll((wasCleared) => {
				if (!wasCleared) {
					console.error("Failed to clear all existing alarms");
					alarmCancelSuccess = false;
				}
				chrome.alarms.onAlarm.removeListener(alarmListener);
				if (chrome.alarms.onAlarm.hasListeners()) {
					console.error("Alarm still has active event listeners attached");
					alarmCancelSuccess = false;
				}
			});
			chrome.storage.local.set({
				notificationData: {
					...notificationData,
					pauseStatus: { isPaused: false, timeRemaining: 0 },
				},
			});
			result.alarmCancelSuccess = alarmCancelSuccess;
			break;
		case "resetExtension":
			initializeExtensionState();
			break;
	}
	sendResponse(result);
}

chrome.runtime.onMessage.addListener(eventListener);

function alarmListener() {
	chrome.storage.local.get("computerState", ({ computerState }) => {
		if (computerState == "active") {
			const opts = {
				iconUrl: notificationData.iconUrl,
				title: notificationData.title,
				message: notificationData.message,
				type: notificationData.type,
				silent: notificationData.silent,
				requireInteraction: false,
			};
			chrome.notifications.clear("PostureNotification", () => {
				chrome.notifications.create("PostureNotification", opts, () => {
					if (chrome.runtime.lastError) {
						console.error("Last error: " + chrome.runtime.lastError);
					}
				});
			});
		}
	});
}

chrome.idle.onStateChanged.addListener(idleStateListener);

function idleStateListener(newState: chrome.idle.IdleState) {
	chrome.storage.local.set({ computerState: newState });
}
