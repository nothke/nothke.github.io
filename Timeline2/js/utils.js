function createText(text, y, link) {
    if (link === void 0) { link = ""; }
    var textElement = document.createElementNS(svgns, "text");
    textElement.setAttributeNS(null, 'x', "10");
    textElement.setAttributeNS(null, 'y', (y + threads.yBase - 5).toString());
    if (link != "") {
        textElement.href = link;
    }
    var textNode = document.createTextNode(text);
    textElement.appendChild(textNode);
    //svg.appendChild(textElement);
    return textElement;
}
