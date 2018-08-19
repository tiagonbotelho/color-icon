var colorIconFavicon;

chrome.extension.sendMessage({ action: "get" }, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            if (response && response.info && response.faviconUrl) {
                var newFavicon = document.createElement("link");
                var links = document.head.getElementsByTagName("link");
                var settings = {
                    animation: 'none',
                    bgColor: response.info.color
                };

                newFavicon.setAttribute("rel", "icon");
                newFavicon.type = "image/x-icon";
                newFavicon.href = response.faviconUrl;

                for (i = 0; i < links.length; i++) {
                    rel = links[i].getAttribute("rel");

                    if (rel && rel.match(/^(shortcut )?icon$/i)) {
                        document.head.removeChild(links[i]);
                    }
                }

                document.head.appendChild(newFavicon);

                if (response.info.position) {
                    settings.position = response.info.position;
                }

                colorIconFavicon = new Favico(settings);
                colorIconFavicon.badge(' ');
            }
        }
    }, 10);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var faviconUrl;
    var info = request.info;
    var settings = { animation: 'none' };

    if (colorIconFavicon) {
        colorIconFavicon.reset();
    }

    if (request.info === "reset") {
        return;
    }

    var links = document.head.getElementsByTagName("link");
    for (i = 0; i < links.length; i++) {
        rel = links[i].getAttribute("rel");

        if (rel && rel.match(/^(shortcut )?icon$/i)) {
            faviconUrl = links[i].href;
        }
    }

    chrome.extension.sendMessage({ action: "get", faviconUrl: faviconUrl }, function(response) {
        if (!(response && response.info && response.faviconUrl)) {
            sendResponse({ farewell: "something went wrong" });
        }

        var newFavicon = document.createElement("link");
        var links = document.head.getElementsByTagName("link");
        var settings = {
            animation: 'none',
            bgColor: response.info.color
        };

        newFavicon.setAttribute("rel", "icon");
        newFavicon.type = "image/x-icon";
        newFavicon.href = response.faviconUrl;

        for (i = 0; i < links.length; i++) {
            rel = links[i].getAttribute("rel");

            if (rel && rel.match(/^(shortcut )?icon$/i)) {
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

        colorIconFavicon = new Favico(settings);
        colorIconFavicon.badge(' ');

        sendResponse({ farewell: "favicon set with success" });
    });
});

window.onbeforeunload = function(e) {
    if (colorIconFavicon) {
        colorIconFavicon.reset();
    }
}
