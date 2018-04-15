function reloadCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
	var tab = tabs[0];

	chrome.tabs.reload(tab.id);
    });
}

function sendAction(request) {
    chrome.extension.sendMessage(request, function(_response) {
	reloadCurrentTab();
    });
}

document.getElementById("reset").addEventListener("click", function(event) {
    event.preventDefault();

    sendAction({ action: "reset_data" });
});

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

    sendAction(request);
});
