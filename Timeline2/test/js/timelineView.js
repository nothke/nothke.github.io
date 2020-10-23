var TimelineView = /** @class */ (function () {
    function TimelineView() {
        this.zoomLevel = 5;
        this.scale = 0;
        this.x = 0;
        this.scrollMult = 0.1;
        this.minZoomLevelLimit = -7;
        this.maxZoomLevelLimit = 10;
    }
    TimelineView.prototype.log2 = function (x) { return Math.log(x) * Math.LOG2E; };
    ;
    TimelineView.prototype.calcScale = function () {
        this.scale = Math.pow(2, this.zoomLevel);
    };
    TimelineView.prototype.setZoomFromScale = function (scale) {
        this.zoomLevel = this.log2(scale);
        this.calcScale();
    };
    TimelineView.prototype.scroll = function (by) {
        this.zoomLevel -= by * this.scrollMult;
        if (this.zoomLevel < this.minZoomLevelLimit)
            this.zoomLevel = this.minZoomLevelLimit;
        else if (this.zoomLevel > this.maxZoomLevelLimit)
            this.zoomLevel = this.maxZoomLevelLimit;
        this.calcScale();
    };
    TimelineView.prototype.move = function (by) {
        this.x += by / this.scale;
    };
    return TimelineView;
}());
