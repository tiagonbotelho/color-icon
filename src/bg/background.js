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
            var current_tab = tabs[0];
            var key = tabKey(current_tab);
            var key_id = tabId(current_tab);

            if (request.color) {
                request.color = colorToHex(request.color);
            }

            chrome.storage.sync.get(key, function(data) {
                var obj = data || {};
                obj[key] = obj[key] || {};
                obj[key_id] = key;

                if (request.color) {
                    obj[key].color = request.color;
                }

                if (request.position) {
                    obj[key].position = request.position;
                }

                chrome.storage.sync.set(obj);
            });

            chrome.tabs.sendMessage(current_tab.id, { info: request }, function(_response) {
                sendResponse({ info: "Values were set." });
            });
        });
    },

    reset: function(request, sendResponse) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var current_tab = tabs[0];
            var key = tabKey(current_tab);

            chrome.storage.sync.remove(key);

            chrome.tabs.sendMessage(current_tab.id, { info: "reset" }, function(_response) {
                sendResponse({ info: "Values were reset." });
            });
        });
    }
}

/* Event handler */
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.action) {
        case "get_data":
            var tab = sender.tab || request.tab;

            data.get(request, tab, sendResponse);
            return true;
        case "reset_data":
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
                let prev_key = info.fromIndex.toString() + tab.url;

                data[tabId(tab)] = tabKey(tab);
                data[tabKey(tab)] = data[prev_key];

                chrome.storage.sync.remove(prev_key);
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
