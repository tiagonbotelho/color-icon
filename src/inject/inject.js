chrome.extension.sendMessage({ action: "get_favicon" }, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      if (response.info) {
	var favicon=new Favico({
	  animation:'none',
	  bgColor: response.info
	});
      }

      favicon.badge(' ');
    }
  }, 10);
});
