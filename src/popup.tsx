import React, { useState } from "react";
import ReactDOM from "react-dom";

function Popup() {
	let [color, setColor] = useState("");

	chrome.storage.sync.get("color", ({ color }) => {
		setColor(color);
	});

	async function handleClick() {
		let [tab] = await chrome.tabs.query({
			active: true,
			currentWindow: true,
		});

		if (tab.id) {
			chrome.tabs.sendMessage(
				tab.id,
				{
					color,
				},
				(msg) => {
					console.log("result message:", msg);
				}
			);
		}
	}

	return (
		<>
			<button
				style={{ backgroundColor: color ? color : "gray" }}
				onClick={handleClick}
			></button>
		</>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>,
	document.getElementById("root")
);
