import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

export default function HelpPage() {
	function sendMessage(message) {
		// put this function in a utilities file later (with an optional callback function as 2nd param)
		chrome.runtime.sendMessage(message);
	}

	function handleExtensionResetRequest() {
		let message = {
			request: "resetExtension",
		};

		sendMessage(message);
	}

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
					If you are having issues, it may help to reset the extension via the
					button below. It will clear the existing alarm and the local storage
					within Chrome this extension utilizes.
				</p>
			</Row>
			<Row>
				<Col>
					<Button
						variant='outline-primary'
						onClick={handleExtensionResetRequest}
						className='button'
					>
						Reset Extension
					</Button>
				</Col>
			</Row>
		</Container>
	);
}
