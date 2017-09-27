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