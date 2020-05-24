var TextNode = /** @class */ (function () {
    function TextNode(text, appendTo, link) {
        if (appendTo === void 0) { appendTo = null; }
        if (link === void 0) { link = ""; }
        this.x = 0;
        this.y = 0;
        this.text = text;
        this.element = document.createElementNS(svgns, "text");
        //this.element.setAttributeNS(null, 'x', x.toString());
        //this.element.setAttributeNS(null, 'y', y.toString()); // (y + threads.yBase - 5).toString()
        this.element.classList.add("unselectable");
        if (link != "") {
            this.link = link;
        }
        var textNode = document.createTextNode(text);
        this.element.appendChild(textNode);
        if (appendTo)
            appendTo.appendChild(this.element);
        //svg.appendChild(textElement);
    }
    TextNode.prototype.setX = function (x) {
        this.x = x;
        return this;
    };
    TextNode.prototype.setY = function (y) {
        this.y = y;
        return this;
    };
    TextNode.prototype.update = function () {
        this.element.setAttributeNS(null, "x", this.x.toString());
        this.element.setAttributeNS(null, "y", this.y.toString());
        return this;
    };
    return TextNode;
}());
