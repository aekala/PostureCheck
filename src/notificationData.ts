export class NotificationData {
	public title: string;
	public message: string;
	public type: chrome.notifications.TemplateType;
	public iconUrl: string;

	constructor({
		title = "PostureCheck",
		message = "Posture Check!",
		type = "basic",
		iconUrl = "../images/get_started16.png",
	} = {}) {
		this.title = title;
		this.message = message;
		this.type = type as chrome.notifications.TemplateType;
		this.iconUrl = iconUrl;
	}
}
