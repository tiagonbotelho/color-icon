function colorToHex(color) {
    switch(color) {
        case "pink": return "#D37E8B";
        case "green": return "#B5DC73";
        case "blue": return "#81C6C6";
        case "yellow": return "#FFCD6F";
        case "orange": return "#F5903F";
        case "purple": return "#895374";
    }
}

function tabKey(tab) {
    return tab.index.toString() + tab.url;
}

function tabId(tab) {
    return tab.id.toString();
}
