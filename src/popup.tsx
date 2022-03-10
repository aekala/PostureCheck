import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Container, Nav } from "react-bootstrap";
import HomePage from "./homepage";
import Options from "./options";
import HelpPage from "./helppage";

function Popup() {
	const [key, setKey] = useState("home");
	const [timeDisplay, setTimeDisplay] = useState(null);

	const content = () => {
		switch (key) {
			case "home":
				return (
					<HomePage
						timeDisplay={timeDisplay}
						setTimeDisplay={setTimeDisplay}
						changeViewToOptionsPage={() => setKey("options")}
					/>
				);
				break;
			case "options":
				return <Options />;
				break;
			case "help":
				return <HelpPage />;
				break;
		}
	};

	return (
		<Container fluid className='mainContainer p-0'>
			<Nav fill variant='tabs' activeKey={key} onSelect={(k) => setKey(k)}>
				<Nav.Item>
					<Nav.Link eventKey='home'>Home</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey='options'>Options</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey='help'>Help</Nav.Link>
				</Nav.Item>
			</Nav>
			<div className='contentContainer'>{content()}</div>
		</Container>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>,
	document.getElementById("root")
);
