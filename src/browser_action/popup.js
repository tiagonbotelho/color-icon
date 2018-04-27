var popup = {
    hexToColor: function(hex) {
        switch(hex) {
            case "#FB635E": return "red";
            case "#86E26D": return "green";
            case "#53BDF6": return "blue";
            case "#FDD74F": return "yellow";
            case "#FCAB47": return "orange";
            case "#D58FE3": return "purple";
        };
    },

    sendAction: function(request) {
        chrome.extension.sendMessage(request, function(_response) {
        });
    }
};

document.getElementById("reset").addEventListener("click", function(event) {
    event.preventDefault();

    popup.sendAction({ action: "reset_data" });
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

    popup.sendAction(request);
});

document.addEventListener("DOMContentLoaded", function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var tab = tabs[0];
        var request = { action: "get_data", tab: tab };

        chrome.extension.sendMessage(request, function(response) {
            if (response.info.position) {
                document.getElementById(response.info.position).checked = true;
            }

            if (response.info.color) {
                var color = popup.hexToColor(response.info.color);
                document.querySelector(`input[value='${color}']`).checked = true;
            }
        });
    });
});
