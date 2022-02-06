let page = document.getElementById("buttonDiv");
let selectedClassName = "current";
const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

function handleButtonClick(event) {
	chrome.storage.sync.get((color) => {
		console.log(color);
	});
	let currentSelection = event.target.parentElement.querySelector(
		`.${selectedClassName}`
	);

	let newSelection = event.target;

	let newColor = newSelection.dataset.color;
	if (currentSelection && newSelection && currentSelection !== newSelection) {
		currentSelection.classList.remove(selectedClassName);
		newSelection.classList.add(selectedClassName);
		chrome.storage.sync.set({ color: newColor });
	}
}

function constructOptions(buttonColors) {
	chrome.storage.sync.get("color", (data) => {
		let currentColor = data.color;

		for (let buttonColor of buttonColors) {
			let button = document.createElement("button");
			button.dataset.color = buttonColor;
			button.style.background = buttonColor;
			button.style.backgroundColor = buttonColor;

			if (buttonColor == currentColor) {
				button.classList.add(selectedClassName);
			}

			button.addEventListener("click", handleButtonClick);
			page.appendChild(button);
		}
	});
}

constructOptions(presetButtonColors);
