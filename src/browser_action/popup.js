document.getElementById("faviform").addEventListener("submit", function(event) {
    event.preventDefault();

    var position = document.querySelector('input[name="position"]:checked');
    var color = document.querySelector('input[name="color"]:checked');
    var request = { action: "set" };

    if (position) {
	request["position"] = position.value;
    }

    if (color) {
	request["color"] = color.value;
    }

    chrome.extension.sendMessage(request, function(response) {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
	    var tab = tabs[0];

	    chrome.tabs.reload(tab.id);
	});
    });
});
