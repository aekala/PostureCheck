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
		<Container fluid>
			<Row>
				<p>HOW TO USE POSTURECHECK</p>
			</Row>
			<Row>
				<Col>
					<Button
						variant='outline-primary'
						onClick={handleExtensionResetRequest}
					>
						Reset Extension
					</Button>
				</Col>
			</Row>
		</Container>
	);
}
