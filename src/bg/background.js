function colorToHex(color) {
    switch(color) {
    case "red": return "#ffb3ba";
    case "green": return "#baffc9";
    }
}

function tabKey(tab) {
    return tab.id.toString();
}

function getData(tab, sendResponse) {
    var key = tabKey(tab);

    chrome.storage.local.get(key, function(data) {
	sendResponse({ info: data[key] });
    });
}

function setData(request, sendResponse) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
	var key = tabKey(tabs[0]);

	chrome.storage.local.get(key, function(data) {
	    console.log(data);
	    var obj = data || {};
	    obj[key] = obj[key] || {};

	    if (request.color) {
		obj[key].color = colorToHex(request.color);
	    }

	    if (request.position) {
		obj[key].position = request.position;
	    }

	    chrome.storage.local.set(obj);
	});

	sendResponse({ info: "Values were set." });
    });
}

/* Events */

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.action) {
    case "get_data":
	getData(sender.tab, sendResponse);
	return true;
    case "set":
	setData(request, sendResponse);
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

