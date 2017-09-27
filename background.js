//Enables or disables the plugin button based on the current tab url
chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        hostEquals: 'www.everydollar.com'
                    }
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

//Reinjects the scripts when the plugin button is clicked, to update the balance
chrome.pageAction.onClicked.addListener(function(tab) {
   chrome.tabs.executeScript(null, {file: "spin.min.js"});
});
chrome.pageAction.onClicked.addListener(function(tab) {
   chrome.tabs.executeScript(null, {file: "everyDollarExtension.js"});
});
