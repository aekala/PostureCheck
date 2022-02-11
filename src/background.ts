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
			chrome.alarms.clearAll();
			chrome.alarms.onAlarm.removeListener(alarmListener);
			if (chrome.alarms.onAlarm.hasListeners()) {
				console.error("Alarm still has listeners attached");
			}
			chrome.alarms.create("PostureCheck", {
				periodInMinutes: notificationData.interval,
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

function alarmListener(alarmInfo) {
	console.log(alarmInfo.name);
	console.log("alarm: " + notificationData.message);
	chrome.notifications.clear("PostureAlarm", (wasCleared) => {
		console.log("Was Cleared?: " + wasCleared);
	});
	chrome.notifications.create("PostureAlarm", {
		iconUrl: notificationData.iconUrl,
		title: notificationData.title,
		message: notificationData.message,
		type: notificationData.type,
	});
}
