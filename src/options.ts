let page: HTMLElement = document.getElementById("buttonDiv");
let selectedClassName: string = "current";
const presetButtonColors: string[] = [
	"#3aa757",
	"#e8453c",
	"#f9bb2d",
	"#4688f1",
];

function handleButtonClick(event): void {
	let currentSelection = event.target.parentElement.querySelector(
		`.${selectedClassName}`
	);

	let newSelection: HTMLElement = event.target;
	const newColor: string = newSelection.dataset.color;
	if (currentSelection && newSelection && currentSelection !== newSelection) {
		currentSelection.classList.remove(selectedClassName);
		newSelection.classList.add(selectedClassName);
		chrome.storage.sync.set({ color: newColor });
	}
}

function constructOptions(buttonColors: string[]): void {
	chrome.storage.sync.get("color", (data) => {
		let currentColor: string = data.color;

		for (let buttonColor of buttonColors) {
			let button: HTMLElement = document.createElement("button");
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
