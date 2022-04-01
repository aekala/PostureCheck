import React from "react";
import { Container, Row } from "react-bootstrap";

export default function HelpPage() {
	return (
		<Container fluid className='helppageContainer'>
			<Row>
				<h1>How To Use PostureCheck</h1>
				<p>
					PostureCheck allows you to set an alarm that gives off a notification
					reminding you to check in on your posture.
				</p>
				<br />
				<p>
					If you wish to create an alarm to your preferences you can make those
					changes in the Options tab. There you can adjust the time interval for
					notifications, as well as the title and message for your
					notifications. So really you can create a notification for anything
					you want, not just posture.
				</p>
				<br />
				<p>
					If you are having issues, it may help to reload the extension at
					chrome://extensions. Doing this will clear any existing alarm and the
					local storage within Chrome this extension utilizes.
				</p>
			</Row>
		</Container>
	);
}
