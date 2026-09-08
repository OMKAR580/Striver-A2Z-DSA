document.addEventListener("DOMContentLoaded", () => {
    const statusDot = document.getElementById("status-dot");
    const statusText = document.getElementById("status-text");
    const statusDetail = document.getElementById("status-detail");
    const retryBtn = document.getElementById("retry-btn");
    const triggerSyncBtn = document.getElementById("trigger-sync-btn");

    function checkServer() {
        statusDot.className = "status-indicator";
        statusText.textContent = "Connecting...";

        fetch("http://localhost:3456/api/git-status")
            .then(res => res.json())
            .then(data => {
                statusDot.className = "status-indicator online";
                statusText.textContent = "Sync Server Online ✅";
                statusDetail.textContent = data.lastCommit ? `Git: ${data.lastCommit.substring(0, 30)}...` : "Server connected (Port 3456)";
            })
            .catch(err => {
                statusDot.className = "status-indicator offline";
                statusText.textContent = "Server Offline ❌";
                statusDetail.textContent = "Run start_sync_server.bat locally!";
            });
    }

    checkServer();
    retryBtn.addEventListener("click", checkServer);

    triggerSyncBtn.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, { type: "TRIGGER_STRIVER_SYNC" }, (res) => {
                    window.close(); // Close toolbar popup so webpage modal is visible
                });
            }
        });
    });
});
