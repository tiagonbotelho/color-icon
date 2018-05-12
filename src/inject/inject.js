var favicon;

chrome.extension.sendMessage({ action: "get_data" }, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            if (response.info && response.faviconUrl) {
                var newFavicon = document.createElement("link");
                var links = document.head.getElementsByTagName("link");
                var settings = {
                    animation: 'none',
                    bgColor: response.info.color
                };

                newFavicon.setAttribute("rel", "icon");
                newFavicon.type = "image/x-icon";
                newFavicon.href = response.faviconUrl;

                for (i=0; i<links.length; i++) {
                    if (links[i].getAttribute("rel").match(/^(shortcut )?icon$/i)) {
                        document.head.removeChild(links[i]);
                    }
                }

                document.head.appendChild(newFavicon);

                if (response.info.position) {
                    settings.position = response.info.position;
                }

                favicon = new Favico(settings);
                favicon.badge(' ');
            }
        }
    }, 10);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var info = request.info;
    var settings = {
        animation: 'none'
    };

    if (favicon) {
        favicon.reset();
    }

    if (request.info === "reset") {
        return;
    }

    var faviconUrl;
    var links = document.head.getElementsByTagName("link");
    for (i = 0; i < links.length; i++) {
        if (links[i].getAttribute("rel").match(/^(shortcut )?icon$/i)) {
            faviconUrl = links[i].href;
        }
    }

    chrome.extension.sendMessage({ action: "get_data", faviconUrl: faviconUrl }, function(response) {

        if (response.info && response.faviconUrl) {
            var newFavicon = document.createElement("link");
            var links = document.head.getElementsByTagName("link");
            var settings = {
                animation: 'none',
                bgColor: response.info.color
            };

            newFavicon.setAttribute("rel", "icon");
            newFavicon.type = "image/x-icon";
            newFavicon.href = response.faviconUrl;

            for (i=0; i<links.length; i++) {
                if (links[i].getAttribute("rel").match(/^(shortcut )?icon$/i)) {
                    document.head.removeChild(links[i]);
                }
            }

            document.head.appendChild(newFavicon);

            if (response.info.color) {
                settings.bgColor = info.color;
            }

            if (response.info.position) {
                settings.position = info.position;
            }

            favicon = new Favico(settings);
            favicon.badge(' ');

            sendResponse({ farewell: "favicon set with success" });
        }
    });
});

window.onbeforeunload = function(e) {
    if (favicon) {
        favicon.reset();
    }
}
