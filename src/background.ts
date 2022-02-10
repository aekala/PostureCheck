let notificationMessage;

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.clear();
	chrome.storage.sync.set({ notificationText: "Posture Check!" });
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
			notificationMessage = message.alarmMessage;
			chrome.alarms.clearAll();
			chrome.alarms.onAlarm.removeListener(alarmListener);
			chrome.alarms.create(message.alarmMessage, {
				periodInMinutes: message.alarmPeriodInMinutes,
			});
			chrome.alarms.onAlarm.addListener(alarmListener);
			break;
	}
	sendResponse();
}

chrome.runtime.onMessage.addListener(eventListener);

function alarmListener(alarmInfo) {
	console.log(alarmInfo.name);
	console.log("alarm: " + notificationMessage);
	chrome.notifications.clear("PostureAlarm", (wasCleared) => {
		console.log("Was Cleared?: " + wasCleared);
	});
	chrome.notifications.create("PostureAlarm", {
		type: "basic",
		iconUrl: "../images/get_started16.png",
		title: "PostureCheck",
		message: notificationMessage,
	});
}
