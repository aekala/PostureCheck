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
			chrome.alarms.clearAll();
			chrome.alarms.onAlarm.removeListener(alarmListener);
			chrome.alarms.create({ periodInMinutes: message.alarmPeriodInMinutes });
			chrome.alarms.onAlarm.addListener(() => alarmListener(message));
			break;
	}
	sendResponse();
}

chrome.runtime.onMessage.addListener(eventListener);

function alarmListener(message) {
	chrome.notifications.clear("PostureAlarm");
	chrome.notifications.create("PostureAlarm", {
		type: "basic",
		iconUrl: "../images/get_started16.png",
		title: "PostureCheck",
		message: message.alarmMessage,
	});
}
