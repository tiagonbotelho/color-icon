var data = {
    get: function(request, tab, sendResponse) {
        let key = tabKey(tab);
        var holder = document.createElement("img");

        holder.addEventListener("load", function(evt) {
            var canvas = document.createElement("canvas");
            canvas.width = holder.width;
            canvas.height = holder.height;

            var context = canvas.getContext("2d");
            context.drawImage(holder, 0, 0);

            chrome.storage.sync.get(key, function(data) {
                sendResponse({ info: data[key], faviconUrl: canvas.toDataURL() });
            });
        });

        holder.src = request.faviconUrl || tab.favIconUrl;
    },

    set: function(request, sendResponse) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var currentTab = tabs[0];
            var key = tabKey(currentTab);
            var keyId = tabId(currentTab);

            if (request.color) {
                request.color = colorToHex(request.color);
            }

            chrome.storage.sync.get(key, function(data) {
                var obj = data || {};
                obj[key] = obj[key] || {};
                obj[keyId] = key;

                if (request.color) {
                    obj[key].color = request.color;
                }

                if (request.position) {
                    obj[key].position = request.position;
                }

                chrome.storage.sync.set(obj);
            });

            chrome.tabs.sendMessage(currentTab.id, { info: request }, function(_response) {
                sendResponse({ info: "Values were set." });
            });
        });
    },

    reset: function(request, sendResponse) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var currentTab = tabs[0];
            var key = tabKey(currentTab);

            chrome.storage.sync.remove(key);

            chrome.tabs.sendMessage(currentTab.id, { info: "reset" }, function(_response) {
                sendResponse({ info: "Values were reset." });
            });
        });
    },
}

/* Event handler */
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.action) {
        case "get":
            var tab = sender.tab || request.tab;

            data.get(request, tab, sendResponse);
            return true;
        case "reset":
            data.reset(request, sendResponse);
            return true;
        case "set":
            data.set(request, sendResponse);
            return true;
        default:
            return false;
    }
}
);

// Whenever we update the tab with a url change we need to remove
// the previous key
chrome.tabs.onUpdated.addListener(function(_id, change, tab) {
    chrome.storage.sync.get(tabKey(tab), function(data) {
        if (change.url && Object.keys(data).length === 0) {
            chrome.storage.sync.remove([tabId(tab), tabKey(tab)]);
        }
    });
});

// Since the key is based on the index of the tab we need to update the key
// when we move the tab
chrome.tabs.onMoved.addListener(function(id, info) {
    chrome.tabs.get(id, function(tab) {
        chrome.storage.sync.get(info.fromIndex.toString() + tab.url, function(data) {
            if (Object.keys(data).length !== 0) {
                let prevKey = info.fromIndex.toString() + tab.url;

                data[tabId(tab)] = tabKey(tab);
                data[tabKey(tab)] = data[prevKey];

                chrome.storage.sync.remove(prevKey);
                chrome.storage.sync.set(data);
            }
        })
    });
});

// When a tab is closed we need to clean up every data we have on it
chrome.tabs.onRemoved.addListener(function(tabId, info) {
    var keyId = tabId.toString();

    chrome.storage.sync.get(keyId, function(data) {
        chrome.storage.sync.remove([data[keyId], keyId]);
    });
})

// Whenever the extension gets installed/updated we need to reload every tab in the window
chrome.runtime.onInstalled.addListener(function() {
    reloadMessage = "In order to use Color Icon you must first reload every open tab. \n\n Do you with to do it now?"

    if (confirm(reloadMessage)) {
        chrome.tabs.getAllInWindow(null, function(tabs) {
            for(i = 0; i < tabs.length; i++) {
                chrome.tabs.update(tabs[i].id, { url: tabs[i].url });
            }
        });
    }
});
