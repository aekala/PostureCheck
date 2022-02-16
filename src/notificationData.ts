export class NotificationData {
	public title: string;
	public message: string;
	public type: chrome.notifications.TemplateType;
	public iconUrl: string;
	public interval: number;
	public silent: boolean;

	constructor({
		title = "PostureCheck",
		message = "Posture Check!",
		type = "basic",
		iconUrl = "../images/zen.jpg",
		interval = 1,
		silent = false,
	} = {}) {
		this.title = title;
		this.message = message;
		this.type = type as chrome.notifications.TemplateType;
		this.iconUrl = iconUrl;
		this.interval = interval;
		this.silent = silent;
	}
}
