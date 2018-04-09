function colorToHex(color) {
  switch(color) {
  case "red": return "#ffb3ba";
  case "green": return "#baffc9";
  }
}

function setColor(color, sendResponse) {
  var hex = colorToHex(color);

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var obj = {};
    var tab_id = tabs[0].id.toString();

    obj[tab_id] = hex;
    chrome.storage.local.set(obj);

    sendResponse({info: "Value was set for " + tab_id});
  });
}

function getFaviconInfo(id, sendResponse) {
  chrome.storage.local.get(id.toString(), function(data) {
    var info = data[id.toString()];

    sendResponse({info: info});
  });
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.action) {
    case "get_favicon":
      var tab_id = sender.tab.id.toString();
      getFaviconInfo(tab_id, sendResponse);
      return true;
    case "set":
      setColor(request.color, sendResponse);
      return true;
    default:
      return false;
    }
  }
);
