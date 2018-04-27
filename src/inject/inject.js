var favicon;

chrome.extension.sendMessage({ action: "get_data" }, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            if (response.info) {
                var settings = {
                    animation: 'none',
                    bgColor: response.info.color
                };

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

    if (info.color) {
        settings.bgColor = info.color;
    }

    if (info.position) {
        settings.position = info.position;
    }

    favicon = new Favico(settings);
    favicon.badge(' ');

    sendResponse({ farewell: "favicon set with success" });
});
