"use strict";
exports.__esModule = true;
var SVGNS = "http://www.w3.org/2000/svg";
var svg = document.createElementNS(SVGNS, "svg");
document.body.appendChild(svg);
var timeline = new TimeThread(svg);
var stamps = [
    new Timestamp(new Date("01 Feb 1970 00:00:00 GMT"), 100, 20),
    new Timestamp(new Date("01 Mar 1970 00:00:00 GMT"), 0, 10),
    new Timestamp(new Date("01 Apr 1970 00:00:00 GMT"), 100, 20),
    new Timestamp(new Date("01 Apr 1970 00:00:00 GMT"), 0, 10),
];
timeline.add("#f06", stamps);
//timeline.add(0, 0, "#f06", [100, 200, 300]);
//timeline.add(20, 0, "#2299ff", [400, 500, 600]);
//timeline.add(20, 0, "#22ff99", [500, 550, 600]);
//timeline.init();
timeline.repaint(0, 0.3, window.innerWidth / 2);
