// Striver DSA Auto-Sync Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
    console.log("🚀 Striver DSA Auto-Sync Extension Installed!");
});

// Proxy API requests from content scripts (bypasses HTTPS mixed-content restrictions)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "CHECK_SERVER") {
        fetch("http://localhost:3456/api/git-status")
            .then(res => res.json())
            .then(data => sendResponse({ online: true, data }))
            .catch(err => sendResponse({ online: false, error: err.message }));
        return true;
    }

    if (request.type === "GET_FOLDERS") {
        fetch("http://localhost:3456/api/folders")
            .then(res => res.json())
            .then(data => sendResponse(data))
            .catch(err => sendResponse({ success: false, folders: [], error: err.message }));
        return true;
    }

    if (request.type === "PUSH_CODE") {
        fetch("http://localhost:3456/api/push", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request.data)
        })
            .then(res => res.json())
            .then(data => sendResponse(data))
            .catch(err => sendResponse({ success: false, message: "Local server (http://localhost:3456) connection failed. Make sure start_sync_server.bat is running!" }));
        return true;
    }
});
