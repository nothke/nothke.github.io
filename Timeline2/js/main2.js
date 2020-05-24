function log2(x) { return Math.log(x) * Math.LOG2E; }
;
var numberOfElements = 60;
var view = new TimelineView();
//let blocks = []
// Create SVG
var svgns = "http://www.w3.org/2000/svg";
//var svg = document.createElementNS(svgns, "svg");
//document.body.appendChild(svg);
var svgElement = document.getElementById("main_svg");
var e = svgElement;
if (!(e instanceof SVGSVGElement))
    throw new Error("Expected e to be an SVGSVGElement, was " + (e && e.constructor && e.constructor.name || e));
var _e = svgElement;
var svg = _e;
console.log("Test: " + svg);
//console.log(svgElement);
//var svg: SVGSVGElement = svgElement[0];
// TODO: Change when window resizes
console.log(svg);
// locally TypeScript now types e as an HTMLScriptElement, same as if you casted it.
var svgRect = svg.getBoundingClientRect();
var ww = svgRect.width;
var hww = ww / 2;
var wh = svgRect.height;
view.calcScale();
var threads = new TimeThread(svg);
// DATA
var localCsvURL = "data/missions.tsv";
var missionData;
SheetsReader.getSheet(localCsvURL, onLoadCSV);
function onLoadCSV(txt) {
    missionData = new MissionData();
    missionData.loadTSV(txt);
    missionData.buildCraftMissionMap();
    missionData.debugCraftMissionMap();
    buildThreads();
}
function repaint() {
    if (threads != null)
        threads.repaint(view.x, view.scale, ww / 2);
    else
        console.log("Attempting to repaint but threads don't exist");
    updateDateView();
}
// EVENT HANDLING
function onScroll(event) {
    var wheelData = normalizeWheel(event);
    view.scroll(wheelData.spinY);
    repaint();
}
var mouseDown = false;
function onStartDrag(event) {
    mouseDown = true;
}
function onEndDrag(event) {
    mouseDown = false;
}
function onMouseMove(event) {
    if (mouseDown) {
        view.move(event.movementX);
        repaint();
    }
}
// THREADS
function randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
var milisecondsInDay = 8.64e+7;
var colors = [
    "#c9ffba",
    "#baf6ff",
    "#fff1ba",
    "#ffbafd",
    "#ffbaba"
];
function buildThreads() {
    var dateLaunchColumn = missionData.table.getColumnByName("Launch date");
    var dateLandingColumn = missionData.table.getColumnByName("Landing date");
    var missionTypeColumn = missionData.table.getColumnByName("Mission type");
    var shuttle_topY = 100;
    var hubble_topY = 0;
    var iss_topY = 20;
    var mir_topY = 40;
    console.log("svg: " + svg);
    // mir
    threads.add("#ff4466", [
        new Timestamp(new Date("February 20, 1986"), 300, 20),
        new Timestamp(new Date("23 March, 2001"), mir_topY, 20)
    ], new TextNode("Mir", svg), 1);
    // hubble
    threads.add("#77ff88", [
        new Timestamp(new Date("April 25, 1990"), shuttle_topY, 20),
        new Timestamp(new Date(), 0, 20)
    ], new TextNode("Hubble", svg), 1);
    // iss
    threads.add("#3388ff", [
        new Timestamp(new Date("20 Nov, 1998"), 300, 20),
        new Timestamp(new Date(), iss_topY, 20)
    ], new TextNode("ISS", svg), 1);
    var ci = 0;
    missionData.craftMissionMap.forEach(function (missions, craft) {
        var stamps = [];
        var y = 200 + ci * 20;
        var h = 20;
        var ho = 40;
        var noEnd = false;
        console.log("KEY: |" + craft + "|");
        missions.forEach(function (index) {
            var yo = shuttle_topY;
            if (missionTypeColumn[index].startsWith("ISS"))
                yo = iss_topY + 10;
            else if (missionTypeColumn[index] == "Shuttle-Mir")
                yo = mir_topY + 10;
            else if (index == 35 || missionTypeColumn[index].startsWith("Hubble"))
                yo = hubble_topY + 10;
            var launchStr = dateLaunchColumn[index];
            var launchDate = new Date(launchStr);
            var landStr = dateLandingColumn[index];
            var landingDate = new Date(landStr);
            stamps.push(new Timestamp(launchDate, y, h));
            if (landStr != "")
                stamps.push(new Timestamp(landingDate, yo, ho));
            else {
                var yHalf = (y + yo) * 0.5;
                if (craft == "Challenger") {
                    var newDate = new Date(launchDate.getTime() + 73 * 1000);
                    stamps.push(new Timestamp(newDate, yHalf, ho));
                    console.log("Got chal");
                }
                else { // Columbia
                    var newDate = new Date(launchDate.getTime() + 15.8 * milisecondsInDay);
                    stamps.push(new Timestamp(newDate, yo, ho));
                    newDate = new Date(newDate.getTime() + 600000);
                    stamps.push(new Timestamp(newDate, yHalf, ho));
                }
                noEnd = true;
            }
        });
        if (!noEnd)
            stamps.push(new Timestamp(new Date(), y, h));
        threads.add(colors[ci], stamps, new TextNode(craft, svg));
        ci++;
    });
    focusAll();
    repaint();
}
/*
    var startDate = new Date(0); //new Date("1981-04-12 12:00:03");

    // Test
    /*
    for (let ti = 0; ti < 5; ti++) {
        let stamps: Timestamp[] = [];
    
        let h = 20;
        let y0 = ti * h;
        for (let i = 1; i < numberOfElements; i++) {
            //let start = (i * (testWidth + 1));
            //let end = start + testWidth * Math.random();
            let y = i % 2 == 0 ? 0 : 100 + y0;
            stamps.push(new Timestamp(
                new Date(startDate.getTime() + (60 + ti * 30) * i * milisecondsInDay),
                y, h));
            //segs.push(end * 100);
            //createBlock(start, end, i.toString());
        }
        threads.add(randomColor(), stamps);
    }
    
    
    // hubblethetical
    {
        let stamps: Timestamp[] = [];
        for (let i = 0; i < 2; i++) {
            let y = i % 2 == 0 ? 0 : -50;
            stamps.push(new Timestamp(
                new Date(startDate.getTime() + 80 * (i + 1) * milisecondsInDay),
                y, 20));
        }
        threads.add(randomColor(), stamps);
    }
    */
//createBlock(5000, 5000+10);
document.addEventListener("wheel", onScroll);
document.addEventListener("mousedown", onStartDrag);
document.addEventListener("mouseup", onEndDrag);
document.addEventListener("mousemove", onMouseMove);
function update() {
    setTimeout(update, 10);
}
//update();
function focusAll() {
    var _a = threads.getBounds(), median = _a[0], extents = _a[1];
    view.x = -median;
    view.setZoomFromScale(ww / (extents + 10000));
}
function getXFromDate(date) {
    var x = toScaledTime(date);
    return (view.x + x) * view.scale + hww;
}
var DateText = /** @class */ (function () {
    function DateText(text, date, svg) {
        this.node = new TextNode(text, svg);
        this.date = date;
        this.node.setY(wh - 10).update();
    }
    DateText.prototype.update = function () {
        this.node.setX(getXFromDate(this.date)).update();
    };
    return DateText;
}());
var dateTexts = [];
dateTexts.push(new DateText("1980", new Date("1980"), svg));
dateTexts.push(new DateText("1990", new Date("1990"), svg));
dateTexts.push(new DateText("2000", new Date("2000"), svg));
dateTexts.push(new DateText("2010", new Date("2010"), svg));
dateTexts.push(new DateText("2020", new Date("2020"), svg));
function updateDateView() {
    dateTexts.forEach(function (dt) { return dt.update(); });
}
//focusAll();
//repaint();
