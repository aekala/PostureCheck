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
		message = "How's Your Posture?",
		type = "basic",
		iconUrl = "../images/zen.jpg",
		interval = 1,
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
