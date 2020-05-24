var Shit = /** @class */ (function () {
    function Shit() {
    }
    return Shit;
}());
var Timestamp = /** @class */ (function () {
    function Timestamp(date, step, height) {
        this.date = date;
        this.step = step;
        this.height = height;
    }
    ;
    return Timestamp;
}());
var Thread = /** @class */ (function () {
    function Thread(color, stamps, path, text) {
        this.color = color;
        this.stamps = stamps;
        this.path = path;
        this.text = text;
    }
    ;
    return Thread;
}());
function toScaledTime(date) {
    return date.getTime() / 10000000;
}
var TimeThread = /** @class */ (function () {
    function TimeThread(svg) {
        this.yBase = 100;
        this.curvw = 0;
        this.bezwMult = 0;
        this.bezOffset = 1;
        this.bezw = 0;
        this.svg = svg;
        this.threads = [];
    }
    TimeThread.prototype.test = function () {
        console.log("Test");
    };
    TimeThread.prototype.recalc = function () {
        this.bezw = this.curvw * this.bezwMult;
    };
    TimeThread.prototype.add = function (color, segs, titleTextNode, textLevel) {
        if (titleTextNode === void 0) { titleTextNode = null; }
        if (textLevel === void 0) { textLevel = 0; }
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        //path.setAttribute("stroke", "#ffffff");
        //path.setAttribute("stroke-width", "2");
        path.setAttribute("linecap", "round");
        path.setAttribute("linejoin", "round");
        path.setAttribute("fill", color);
        path.setAttribute("filter", "url(#f2)");
        svg.appendChild(path);
        var textOffset = -5;
        if (titleTextNode) {
            var yText = 0;
            /*
            if (segs[0].step == segs[1].step)
                yText = segs[1].step;
            else
                yText = segs[0].step;
            */
            yText = segs[textLevel].step;
            titleTextNode.setY(this.yBase + yText + textOffset);
            svg.appendChild(titleTextNode.element);
        }
        this.threads.push(new Thread(color, segs, path, titleTextNode));
    };
    /*
    init() {
        // Create path for each thread
        this.threads.forEach(t => {
            t.path.setAttribute("stroke", "#ffffff");
            t.path.setAttribute("stroke-width", "2");
            t.path.setAttribute("linecap", "round");
            t.path.setAttribute("linejoin", "round");
            t.path.setAttribute("fill", t.color);
        })
    }*/
    TimeThread.prototype.repaint = function (offset, scale, halfWindowWidth) {
        var _this = this;
        var hww = halfWindowWidth;
        this.recalc();
        this.threads.forEach(function (thread) {
            var pth = [];
            var segsct = thread.stamps.length;
            //let startX = offset;
            var yOffset = _this.yBase;
            var yStart = yOffset + thread.stamps[0].step;
            var hStart = thread.stamps[0].height;
            //console.log("First: " + x0);
            // Convert dates to numbers
            var cachedSegs = [];
            for (var i = 0; i < segsct; i++) {
                // TODO: convert before repaint
                var x = toScaledTime(thread.stamps[i].date);
                cachedSegs.push((offset + x) * scale + hww);
                //console.log(x + " " + (startX + x) * scale + hww);
            }
            var x0 = cachedSegs[0]; //startX * scale + hww;
            pth = ["M", x0, yStart];
            var yLast = yStart;
            for (var i = 0; i < segsct - 1; i++) {
                var y = yOffset + thread.stamps[i + 1].step;
                var xoff = y < yLast ? _this.bezOffset : -_this.bezOffset;
                var x = cachedSegs[i] + xoff;
                var segsep = cachedSegs[i + 1] - cachedSegs[i];
                var bezw = _this.bezw;
                var curvw = _this.curvw;
                pth.push("L", x, yLast, "C", x + bezw, yLast, x + curvw - bezw, y, x + curvw, y);
                yLast = y;
            }
            // Ending
            var xEnd = cachedSegs[segsct - 1];
            var yEnd = yOffset + thread.stamps[segsct - 1].step; //isBez ? _yStart : _y1;
            var hEnd = thread.stamps[segsct - 1].height; //isBez ? this.bot_h : this.top_h;
            pth.push("L", xEnd, yEnd);
            pth.push("L", xEnd, yEnd - hEnd);
            yLast = yEnd - hEnd;
            // Return line
            for (var i = segsct - 2; i >= 0; i--) {
                var h = thread.stamps[i].height;
                var y = yOffset + thread.stamps[i].step - h; //isBez ? _y1 : _y0;
                var x = cachedSegs[i];
                var bezw = _this.bezw;
                var curvw = _this.curvw;
                pth.push("L", x + curvw, yLast, "C", x - bezw + curvw, yLast, x - curvw + bezw + curvw, y, x - curvw + curvw, y);
                yLast = y;
            }
            pth.push("L", x0, yStart - hStart, "Z");
            // Assemble string
            var path_str = "";
            pth.forEach(function (str) {
                path_str += str + " ";
            });
            // Set path
            thread.path.setAttribute("d", path_str);
            var offsetX = 5;
            if (thread.text) {
                if (x0 > 0)
                    thread.text.setX(x0 + offsetX); // .element.setAttributeNS(null, "x", (x0 + 10).toString());
                else
                    thread.text.setX(offsetX);
                //thread.text.setAttributeNS(null, "width", "10");
                thread.text.update();
            }
        });
    };
    TimeThread.prototype.getBounds = function () {
        var min = Number.POSITIVE_INFINITY;
        var max = Number.NEGATIVE_INFINITY;
        this.threads.forEach(function (thread) {
            var start = toScaledTime(thread.stamps[0].date);
            var end = toScaledTime(thread.stamps[thread.stamps.length - 1].date);
            if (start < min)
                min = start;
            if (end > max)
                max = end;
        });
        var median = (min + max) / 2;
        var extents = max - min;
        return [median, extents];
    };
    return TimeThread;
}());
