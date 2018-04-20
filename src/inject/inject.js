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

        var favicon = new Favico(settings);
        favicon.badge(' ');
      }
    }
  }, 10);
});
