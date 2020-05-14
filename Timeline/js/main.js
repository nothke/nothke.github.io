var numberOfElements = 300;

var zoomLevel = 5;
var scale = Math.pow(2, zoomLevel);
var x = 0;
var baseX = 0;

var scrollMult = 0.1;

blocks = []

//var now = new Date();
//alert(now);

// Create SVG
var svgns = "http://www.w3.org/2000/svg";

var svg = document.createElementNS(svgns, "svg");
document.body.appendChild(svg);

// TODO: Change when window resizes
var svgRect = svg.getBoundingClientRect();
var ww = svgRect.width;
var wh = svgRect.height;

function createBlock(start, end, title = "") {
    //var group = document.createElementNS(svgns, "g");
    var rect = document.createElementNS(svgns, "rect");
    rect.setAttribute("width", 100);
    rect.setAttribute("height", wh);

    rect.addEventListener("mouseenter", event => {
        var rt = event.target;
        rt.style.fill = "#D93600";
    });

    rect.addEventListener("mouseleave", event => {
        var rt = event.target;
        rt.style.fill = "#000000";
    });

    var fob = document.createElementNS(svgns, "foreignObject");

    var div = document.createElement("div");
    var text = document.createTextNode(title);

    div.appendChild(text);
    fob.appendChild(div);

    svg.appendChild(rect);
    svg.appendChild(fob);

    block = {
        start: start,
        end: end,
        rect: rect,
        fob: fob,
        text: text
    };
    blocks.push(block);
}

function repaintBlocks() {

    var ww = svg.getBoundingClientRect().width;

    blocks.forEach(b => {
        var bx = b.start;
        var bw = b.end - b.start;

        bx = (x + bx) * scale + ww / 2;
        bw = bw * scale;

        b.rect.setAttribute("x", bx);
        b.rect.setAttribute("width", bw);

        b.fob.setAttribute("x", bx);
        b.fob.setAttribute("width", bw);
    });
}

function onScroll(event) {
    var wheelData = normalizeWheel(event);

    //console.log("Scrollin!" + event.deltaY);
    console.log("Scroll: " + wheelData.spinY);
    //rectX += event.deltaY * 3;
    zoomLevel -= wheelData.spinY * scrollMult;

    scale = Math.pow(2, zoomLevel);
    repaintBlocks();
}

var mouseDown = false;

function onStartDrag(event) {
    mouseDown = true;
    console.log("DOWN");
}

function onEndDrag(event) {
    mouseDown = false;
    console.log("UP");
}

function onMouseMove(event) {
    if (mouseDown) {
        x += event.movementX / scale;
        //console.log("Moving mouse " + x);
        repaintBlocks();
    }
}

function setRect(rect, x, y, width, height) {
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("x", width);
    rect.setAttribute("y", height);
}

//var h = document.createElement("h1");
//var t = document.createTextNode("Hello World");
//h.appendChild(t);
//document.body.appendChild(h);

var testWidth = 3;
for (let i = 0; i < numberOfElements; i++) {
    var start = (i * (testWidth + 1));
    var end = start + testWidth * Math.random();
    createBlock(start, end, i);
}

document.addEventListener("wheel", onScroll);
document.addEventListener("mousedown", onStartDrag);
document.addEventListener("mouseup", onEndDrag);
document.addEventListener("mousemove", onMouseMove);

function update() {

    setTimeout(update, 10);
}

//update();

repaintBlocks();