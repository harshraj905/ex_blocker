chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blockedWords: {} });
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.blockedWords) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ["content.js"]
                });
            }
        });
    }
});
