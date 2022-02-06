var page = document.getElementById("buttonDiv");
var selectedClassName = "current";
var presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];
function handleButtonClick(event) {
    var currentSelection = event.target.parentElement.querySelector(".".concat(selectedClassName));
    var newSelection = event.target;
    var newColor = newSelection.dataset.color;
    if (currentSelection && newSelection && currentSelection !== newSelection) {
        currentSelection.classList.remove(selectedClassName);
        newSelection.classList.add(selectedClassName);
        chrome.storage.sync.set({ color: newColor });
    }
}
function constructOptions(buttonColors) {
    chrome.storage.sync.get("color", function (data) {
        var currentColor = data.color;
        for (var _i = 0, buttonColors_1 = buttonColors; _i < buttonColors_1.length; _i++) {
            var buttonColor = buttonColors_1[_i];
            var button = document.createElement("button");
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
