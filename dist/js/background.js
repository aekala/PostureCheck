var color = "#3aa757";
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ color: color });
});
