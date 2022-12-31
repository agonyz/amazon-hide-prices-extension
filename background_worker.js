var extensionEnabled = true;

/**
 * Content to Background communication
 */
chrome.tabs.query({ currentWindow: true }, function (tabs) {
    tabs.forEach(found_tab => {
        if (extensionEnabled) {
            chrome.action.setIcon({ path: "on.png", tabId: found_tab.id });
            chrome.action.setTitle({ title: "Click to hide prices!", tabId: found_tab.id })
        }
        else {
            chrome.action.setIcon({ path: "off.png", tabId: found_tab.id });
            chrome.action.setTitle({ title: "Click to show prices!", tabId: found_tab.id })
        }
    });
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.provide_enabled === "extensionEnabled") {
            sendResponse({ enabled: extensionEnabled });
        }
    });

/**
 * Extension Enabled and disabled button functionality
 */
chrome.action.onClicked.addListener(function (tab) {
    extensionEnabled = !extensionEnabled;

    chrome.tabs.query({ currentWindow: true }, function (tabs) {
        tabs.forEach(found_tab => {
            chrome.tabs.sendMessage(found_tab.id, { enabled: extensionEnabled }, function (response) {
            });
            if (extensionEnabled) {
                chrome.action.setIcon({ path: "on.png", tabId: found_tab.id });
            }
            else {
                chrome.action.setIcon({ path: "off.png", tabId: found_tab.id });
            }
        });
    });
});

