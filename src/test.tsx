import React, { useState } from "react";
import ReactDOM from "react-dom";
import Button from "./button";

function Options() {
	let [color, setColor] = useState("");

	chrome.storage.sync.get("color", ({ color }) => {
		setColor(color);
	});

	const presetButtonColors: string[] = [
		"#3aa757",
		"#e8453c",
		"#f9bb2d",
		"#4688f1",
	];

	return (
		<>
			<p>Choose a different background color!</p>
			{presetButtonColors.map((buttonColor) => {
				const isSelected = buttonColor == color;
				return <Button color={buttonColor} isSelected={isSelected} />;
			})}
		</>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<Options />
	</React.StrictMode>,
	document.getElementById("root")
);
