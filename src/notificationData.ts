export class NotificationData {
	public title: string;
	public message: string;
	public type: chrome.notifications.TemplateType;
	public iconUrl: string;
	public interval: number;
	public silent: boolean;
	public pauseStatus: PauseStatus;

	constructor({
		title = "PostureCheck",
		message = "How is your posture right now?",
		type = "basic",
		iconUrl = "../images/clock.png",
		interval = 10,
		silent = false,
		pauseStatus = { isPaused: false, timeRemaining: 0 },
	} = {}) {
		this.title = title;
		this.message = message;
		this.type = type as chrome.notifications.TemplateType;
		this.iconUrl = iconUrl;
		this.interval = interval;
		this.silent = silent;
		this.pauseStatus = pauseStatus;
	}
}

class PauseStatus {
	isPaused: boolean;
	timeRemaining: number;
}
