var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TextBlock = /** @class */ (function () {
    function TextBlock(text, date, endDate, yPos, svg) {
        this.node = new TextNode(text, svg);
        this.date = date;
        this.endDate = endDate;
        this.node.setY(yPos).update();
    }
    TextBlock.prototype.update = function () {
        this.startX = getXFromDate(this.date);
        var endX = getXFromDate(this.endDate);
        var offset = 5;
        var x = this.startX + offset;
        if (this.startX < 0)
            x = offset;
        if (endX - offset - this.node.width < offset)
            x = endX - offset - this.node.width;
        this.node.setX(x).update();
    };
    TextBlock.prototype.isInView = function () {
        var startX = getXFromDate(this.date);
        var endX = getXFromDate(this.endDate);
        if (endX < 0 || startX > ww)
            return false;
        return true;
    };
    TextBlock.prototype.append = function () {
        svg.appendChild(this.node.element);
    };
    TextBlock.prototype.unpend = function () {
        this.node.element.parentNode.removeChild(this.node.element);
    };
    TextBlock.prototype.reset = function (startDate, endDate, text, yPos) {
        this.date = startDate;
        this.endDate = endDate;
        this.startX = getXFromDate(this.date);
        this.node.updateText(text);
        this.node.setY(yPos).update();
    };
    return TextBlock;
}());
var RulerTextBlock = /** @class */ (function (_super) {
    __extends(RulerTextBlock, _super);
    function RulerTextBlock(text, date, endDate, yOff, svg) {
        var _this = _super.call(this, text, date, endDate, 0, svg) || this;
        _this.yOff = 0;
        _this.yOff = yOff;
        _this.node.setY(wh - 10 - yOff * 15).update();
        _this.path = document.createElementNS(svgns, "path");
        _this.path.setAttribute("stroke", "#000000");
        _this.path.setAttribute("stroke-width", "0.5");
        _this.path.setAttribute("stroke-opacity", "0.2");
        _this.path.setAttribute("d", "M " + 0 + " 0 v " + wh);
        svg.appendChild(_this.path);
        return _this;
    }
    RulerTextBlock.prototype.update = function () {
        _super.prototype.update.call(this);
        this.path.setAttribute("d", "M " + this.startX + " 0 v " + wh);
    };
    RulerTextBlock.prototype.append = function () {
        _super.prototype.append.call(this);
        svg.appendChild(this.path);
    };
    RulerTextBlock.prototype.unpend = function () {
        _super.prototype.unpend.call(this);
        this.path.parentNode.removeChild(this.path);
    };
    RulerTextBlock.prototype.reset = function (startDate, endDate, text, yOff) {
        this.yOff = yOff;
        this.yPos = wh - 10 - yOff * 15;
        _super.prototype.reset.call(this, startDate, endDate, text, this.yPos);
        this.path.setAttribute("d", "M " + this.startX + " 0 v " + wh);
    };
    return RulerTextBlock;
}(TextBlock));
