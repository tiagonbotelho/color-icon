function colorToHex(color) {
    switch(color) {
    case "red": return "#ffb3ba";
    case "green": return "#baffc9";
    }
}

function tabKey(tab) {
    return tab.id.toString();
}

function setColor(color, sendResponse) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
	var obj = {};
	var key = tabKey(tabs[0]);

	obj[key] = colorToHex(color);
	chrome.storage.local.set(obj);

	sendResponse({ info: "Value was set." });
    });
}

function getFaviconInfo(tab, sendResponse) {
    var key = tabKey(tab);

    chrome.storage.local.get(key, function(data) {
	sendResponse({ info: data[key] });
    });
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.action) {
    case "get_favicon":
	getFaviconInfo(sender.tab, sendResponse);
	return true;
    case "set":
	setColor(request.color, sendResponse);
	return true;
    default:
	return false;
    }
}
);

chrome.tabs.onUpdated.addListener(function(id, change, tab) {
    var key = tabKey(tab);

    if (change.url) {
	chrome.storage.local.remove(tabKey(tab));
    }
});

