import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Container, Nav } from "react-bootstrap";
import HomePage from "./homepage";
import Options from "./options";
import HelpPage from "./helppage";

function Popup() {
	const [key, setKey] = useState("home");
	const [timeDisplay, setTimeDisplay] = useState(null);
	const isInitialMount = useRef(true);

	function updateTimeDisplay(time) {
		chrome.storage.local.set({ timeDisplay: time });
		setTimeDisplay(time);
	}

	useEffect(() => {
		if (isInitialMount.current) {
			chrome.storage.local.get("timeDisplay", (res) => {
				setTimeDisplay(res.timeDisplay);
			});
			isInitialMount.current = false;
		}
	});

	const content = () => {
		switch (key) {
			case "home":
				return (
					<HomePage
						timeDisplay={timeDisplay}
						setTimeDisplay={updateTimeDisplay}
						changeViewToOptionsPage={() => setKey("options")}
					/>
				);
			case "options":
				return <Options />;
			case "help":
				return <HelpPage />;
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
