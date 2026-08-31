// Striver DSA Auto-Sync Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
    console.log("🚀 Striver DSA Auto-Sync Extension Installed!");
});

// Listen for background requests if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "CHECK_SERVER") {
        fetch("http://localhost:3456/api/git-status")
            .then(res => res.json())
            .then(data => sendResponse({ online: true, data }))
            .catch(err => sendResponse({ online: false, error: err.message }));
        return true; // Keep channel open for async response
    }
});
