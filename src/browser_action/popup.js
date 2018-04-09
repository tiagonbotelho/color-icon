var colors = document.querySelectorAll(".color");

colors.forEach(function(color) {
  color.addEventListener("click", function(event) {
    handleColor(event.target);
  });
});

function handleColor(el) {
  var request = { action: "set", color: el.id };

  chrome.extension.sendMessage(request, function(response) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tab = tabs[0];

      chrome.tabs.reload(tab.id);
    });
  });
}
