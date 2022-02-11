import { NotificationData } from "./notificationData";

let notificationData: NotificationData;

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.clear();
	chrome.alarms.clearAll();
	chrome.notifications.clear("PostureAlarm");
	const initialNotificationData: NotificationData = new NotificationData();
	chrome.storage.sync.set({ notificationData: initialNotificationData });
});

function eventListener(message, callback, sendResponse) {
	switch (message.request) {
		case "showNotification":
			chrome.notifications.clear("TEST");
			chrome.notifications.create("TEST", {
				type: "basic",
				iconUrl: "../images/get_started16.png",
				title: "Test Message",
				message: message.text,
			});
			break;
		case "updateAlarm":
			notificationData = message.notificationData;
			console.log(notificationData);
			chrome.alarms.clearAll((wasCleared) => {
				if (!wasCleared) {
					console.error("Failed to clear all existing alarms");
				}
			});
			chrome.alarms.onAlarm.removeListener(alarmListener);
			if (chrome.alarms.onAlarm.hasListeners()) {
				console.error("Alarm still has active event listeners attached");
			}
			chrome.alarms.create("PostureCheck", {
				// periodInMinutes: notificationData.interval,
				periodInMinutes: 0.05,
			});
			chrome.alarms.onAlarm.addListener(alarmListener);
			if (!chrome.alarms.onAlarm.hasListener(alarmListener)) {
				console.error("Failed to attach event listener alarmListener");
			}
			break;
	}
	sendResponse();
}

chrome.runtime.onMessage.addListener(eventListener);

function alarmListener() {
	console.log(notificationData);
	notificationData.timesFired++; //TODO: FIGURE OUT BUG WITH UPDATING TIMES FIRED
	chrome.storage.sync.set({
		notificationData: {
			...notificationData,
			timesFired: notificationData.timesFired,
		},
	});
	chrome.notifications.clear("PostureAlarm", (wasCleared) => {
		if (notificationData.timesFired > 0 && !wasCleared) {
			console.error("Failed to clear all existing notifications");
		}
	});
	chrome.notifications.create("PostureAlarm", {
		iconUrl: notificationData.iconUrl,
		title: notificationData.title,
		message: notificationData.message,
		type: notificationData.type,
		silent: notificationData.silent,
	});
}
