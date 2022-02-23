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
	const postureRatings = [];
	chrome.storage.local.set({
		notificationData: initialNotificationData,
		postureRatings: postureRatings,
		computerState: "active",
	});
	chrome.idle.setDetectionInterval(15);
}

function eventListener(message, sender, sendResponse) {
	switch (message.request) {
		case "updateAlarm":
			notificationData = message.notificationData;
			chrome.alarms.clearAll((wasCleared) => {
				if (!wasCleared) {
					console.error("Failed to clear all existing alarms");
				}
				chrome.alarms.onAlarm.removeListener(alarmListener);
				if (chrome.alarms.onAlarm.hasListeners()) {
					console.error("Alarm still has active event listeners attached");
				}
				chrome.alarms.create("PostureCheck", {
					// periodInMinutes: notificationData.interval,
					periodInMinutes: 0.15,
				});
				chrome.alarms.onAlarm.addListener(alarmListener);
				if (!chrome.alarms.onAlarm.hasListener(alarmListener)) {
					console.error("Failed to attach event listener alarmListener");
				}
			});
			break;
		case "pauseAlarm":
			notificationData = message.notificationData;
			chrome.alarms.clearAll((wasCleared) => {
				if (!wasCleared) {
					console.error("Failed to clear all existing alarms");
				}
				chrome.alarms.onAlarm.removeListener(alarmListener);
				if (chrome.alarms.onAlarm.hasListeners()) {
					console.error("Alarm still has active event listeners attached");
				}
			});
			const timeRemaining = message.timeRemaining;
			chrome.storage.local.set({
				notificationData: {
					...notificationData,
					pauseStatus: { isPaused: true, timeRemaining },
				},
			});
			break;
		case "resumeAlarm":
			notificationData = message.notificationData;
			chrome.alarms.create("PostureCheck", {
				periodInMinutes: 0.15,
				delayInMinutes: notificationData.pauseStatus.timeRemaining / 60.0,
				// delayInMinutes: notificationData.pauseStatus.timeRemaining,
			});
			chrome.alarms.onAlarm.addListener(alarmListener);
			if (!chrome.alarms.onAlarm.hasListener(alarmListener)) {
				console.error(
					"Failed to attach event listener alarmListener when resuming alarm"
				);
			}
			chrome.storage.local.set({
				notificationData: {
					...notificationData,
					pauseStatus: { isPaused: false, timeRemaining: 0 },
				},
			});
			break;
		case "cancelAlarm":
			chrome.alarms.clearAll((wasCleared) => {
				if (!wasCleared) {
					console.error("Failed to clear all existing alarms");
				}
				chrome.alarms.onAlarm.removeListener(alarmListener);
				if (chrome.alarms.onAlarm.hasListeners()) {
					console.error("Alarm still has active event listeners attached");
				}

				chrome.storage.local.set({
					notificationData: {
						...notificationData,
						pauseStatus: { isPaused: false, timeRemaining: 0 },
					},
				});
			});
			break;
		case "resetExtension":
			initializeExtensionState();
			break;
	}
	sendResponse();
}

chrome.runtime.onMessage.addListener(eventListener);

function alarmListener() {
	chrome.storage.local.get("computerState", ({ computerState }) => {
		if (computerState == "active") {
			const button1 = { title: "👍" };
			const button2 = { title: "👎" };
			const opts = {
				iconUrl: notificationData.iconUrl,
				title: notificationData.title,
				message: notificationData.message + "\nHow is your posture right now?",
				type: notificationData.type,
				silent: notificationData.silent,
				requireInteraction: false,
				buttons: [button1, button2],
			};
			chrome.notifications.clear("PostureNotification", () => {
				chrome.notifications.create("PostureNotification", opts, () => {
					console.log("Last error: " + chrome.runtime.lastError);
				});
			});
		}
	});
}

chrome.notifications.onButtonClicked.addListener(notificationRatingsListener);

function notificationRatingsListener(
	notificationId: string,
	buttonIndex: number
) {
	console.log(notificationId);
	console.log(buttonIndex);
	const rating = 1 - buttonIndex;
	const ratingObj = { timestamp: Date.now(), rating: rating };
	chrome.storage.local.get("postureRatings", ({ postureRatings }) => {
		postureRatings.push(ratingObj);
		chrome.storage.local.set({ postureRatings: postureRatings });
	});
}

chrome.idle.onStateChanged.addListener(idleStateListener);

function idleStateListener(newState: chrome.idle.IdleState) {
	chrome.storage.local.set({ computerState: newState });
}
