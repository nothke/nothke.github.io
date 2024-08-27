var xSelectionExtend = 5;
var ySelectionExtend = 5;
var TimeDiv = /** @class */ (function () {
    function TimeDiv(startDate, endDate, yPos, h) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.div = document.createElement("div");
        this.div.classList.add("event-block");
        this.div.style.width = "100px";
        this.div.style.height = (h + ySelectionExtend * 2).toString() + "px";
        this.div.style.top = (yPos - ySelectionExtend).toString() + "px";
        this.div.style.left = "1px";
        document.body.appendChild(this.div);
    }
    TimeDiv.prototype.update = function () {
        var x = getXFromDate(this.startDate) - xSelectionExtend;
        var end = getXFromDate(this.endDate) + xSelectionExtend;
        this.div.style.left = x.toString() + "px";
        this.div.style.width = (end - x).toString() + "px";
    };
    return TimeDiv;
}());
