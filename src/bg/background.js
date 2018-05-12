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

            chrome.storage.local.get(key, function(data) {
                sendResponse({ info: data[key], faviconUrl: canvas.toDataURL() });
            });
        });

        holder.src = request.faviconUrl || tab.favIconUrl;
    },

    set: function(request, sendResponse) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var current_tab = tabs[0];
            var key = tabKey(current_tab);

            if (request.color) {
                request.color = colorToHex(request.color);
            }

            chrome.storage.local.get(key, function(data) {
                var obj = data || {};
                obj[key] = obj[key] || {};

                if (request.color) {
                    obj[key].color = request.color;
                }

                if (request.position) {
                    obj[key].position = request.position;
                }

                chrome.storage.local.set(obj);
            });

            chrome.tabs.sendMessage(current_tab.id, { info: request }, function(_response) {
                sendResponse({ info: "Values were set." });
            });
        });
    },

    reset: function(request, sendResponse) {
        chrome.tabs.query({ active: true, currentWindow: true}, function(tabs) {
            var current_tab = tabs[0];
            var key = tabKey(current_tab);

            chrome.storage.local.remove(key);

            chrome.tabs.sendMessage(current_tab.id, { info: "reset" }, function(_response) {
                sendResponse({ info: "Values were reset." });
            });
        });
    }
}

/* Events */
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

chrome.tabs.onUpdated.addListener(function(_id, change, tab) {
    // If the url of the current tab changed
    //we need to invalidate our storage
    if (change.url) {
        chrome.storage.local.remove(tabKey(tab));
    }
});
