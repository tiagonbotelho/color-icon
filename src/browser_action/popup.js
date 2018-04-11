var colors = document.querySelectorAll(".color");
var positions = document.querySelectorAll(".position");

colors.forEach(function(color) {
    color.addEventListener("click", function(event) {
	handleAction("color", event.target);
    });
});

positions.forEach(function(position) {
    position.addEventListener("click", function(event) {
	handleAction("position", event.target);
    });
});

function handleAction(key, el) {
    var request = { action: "set" };
    request[key] = el.id;

    chrome.extension.sendMessage(request, function(response) {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
	    var tab = tabs[0];

	    chrome.tabs.reload(tab.id);
	});
    });
}
