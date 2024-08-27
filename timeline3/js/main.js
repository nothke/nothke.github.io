var view = new TimelineView();
// Create SVG
var svgns = "http://www.w3.org/2000/svg";
var svgElement = document.getElementById("main_svg");
var e = svgElement;
if (!(e instanceof SVGSVGElement))
    throw new Error("Expected e to be an SVGSVGElement, was " + (e && e.constructor && e.constructor.name || e));
var _e = svgElement;
var svg = _e;
console.log("Test: " + svg);
// Test
{
    var _txt = new TextNode("TEST", svg);
    _txt.setY(100).setX(100).update();
    _txt.element.classList.add("svg-bottom");
}
// TODO: Change when window resizes
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
var tsvDataLoaded = false;
SheetsReader.getSheet(localCsvURL, onLoadCSV);
function onLoadCSV(txt) {
    missionData = new MissionData();
    missionData.loadTSV(txt);
    missionData.buildCraftMissionMap();
    missionData.debugCraftMissionMap();
    tsvDataLoaded = true;
    if (jsonDataLoaded)
        buildThreads();
}
// New JSON data:
GetFile.read("data/flights.json", onLoadJSON);
var jsonDataLoaded = false;
var flights;
function onLoadJSON(txt) {
    flights = JSON.parse(txt);
    jsonDataLoaded = true;
    if (tsvDataLoaded)
        buildThreads();
}
function repaint() {
    if (threads != null)
        threads.repaint(view.x, view.scale, ww / 2);
    else
        console.log("Attempting to repaint but threads don't exist");
    updateDateView();
    missionTextBlocks.forEach(function (mtb) { return mtb.update(); });
    selectableBlocks.forEach(function (sb) { return sb.update(); });
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
    updateMouseDate(event.screenX);
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
var selectableBlocks = [];
var missionTextBlocks = [];
var infobox;
var infoboxWidth = 200;
function px(v) {
    return v.toString() + "px";
}
var infoboxScreen = document.createElement("div");
infoboxScreen.classList.add("full-screen");
document.body.append(infoboxScreen);
var infoboxRoot = document.createElement("div");
infoboxRoot.classList.add("infobox-right");
{
    infobox = document.createElement("div");
    infobox.classList.add("infobox", "nice-font");
    var text = document.createTextNode("");
    infobox.appendChild(text);
    infoboxRoot.appendChild(infobox);
}
function vi(i, k) {
    return missionData.table.getValueInRowByName(i, k);
}
function ttl(str) {
    return "<h6>" + str + "</h6>";
}
function p(str) {
    return "<p>" + str + "</p>";
}
function img(path) {
    return "<img src=\"" + path + "\" height=\"12\"" + ">";
}
function flag(str) {
    var url = "";
    switch (str) {
        case "de":
            url = "https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Flag_of_Germany.svg/35px-Flag_of_Germany.svg.png";
            break;
    }
    if (url !== "")
        return "<img src=\"" + url + "\" height=\"12\">";
}
function showInfoBox(missionIndex) {
    infoboxScreen.appendChild(infoboxRoot);
    var missionRow = missionData.table.getRow(missionIndex);
    var text = "<h3>" + missionNameColumn[missionIndex] + "</h3>"
        + "<br/>" + "Links: "
        + "wiki".link(vi(missionIndex, "Wiki Links")) + ", "
        + "NASA".link("https://www.nasa.gov/mission_pages/shuttle/shuttlemissions/archives/" + missionNameColumn[missionIndex].toLowerCase() + ".html");
    text += ttl("Mission Type:") + p(vi(missionIndex, "Mission type"));
    // CREW
    var crewNames = [];
    function addCrew(columnPrefix, title, max) {
        crewNames = [];
        for (var i = 1; i <= max; i++) {
            var _name = vi(missionIndex, columnPrefix + i);
            if (_name === "")
                break;
            crewNames.push(_name);
        }
        if (crewNames.length > 0) {
            text += ttl(title) + "<p>";
            for (var i = 0; i < crewNames.length; i++) {
                if (i > 0)
                    text += "<br/>";
                text += crewNames[i];
            }
            text += "</p>";
        }
    }
    addCrew("Members ", "Members:", 8);
    addCrew("Launching ", "Launching:", 3);
    addCrew("Landing ", "Landing:", 4);
    // Launch
    text += ttl("Launch Date:") + p(vi(missionIndex, "Launch date"));
    // Landing
    var _ldate = vi(missionIndex, "Landing date");
    if (_ldate !== "")
        text += ttl("Landing Date:") + p(_ldate);
    //missionRow.forEach(value => text += "<br/>" + value);
    infobox.innerHTML = text;
}
function hideInfoBox() {
    if (infoboxScreen.hasChildNodes())
        infoboxScreen.removeChild(infobox);
}
var missionNameColumn;
function addSingleFlightDate(name, color, launchDate, landingDate, y) {
    threads.add(color, [
        new Timestamp(launchDate, 300, 20),
        new Timestamp(landingDate, y, 20)
    ], name, 1);
}
function addSingleFlight(name, color, launchDate, landingDate, y) {
    addSingleFlightDate(name, color, new Date(launchDate), new Date(landingDate), y);
}
var TimeEvent = /** @class */ (function () {
    function TimeEvent(that) {
        this.time = "";
        this.site = "";
        this.time = that.time;
        this.site = that.site;
        this.date = new Date(this.time);
    }
    return TimeEvent;
}());
var Flight = /** @class */ (function () {
    function Flight(that) {
        this.name = "";
        this.launch = null;
        this.landing = null;
        this.name = that.name;
        this.launch = new TimeEvent(that.launch);
        this.landing = new TimeEvent(that.landing);
    }
    return Flight;
}());
// function forceCast<T>(input: any): T {
//     return input;
// }
function addHoverRect(infoBoxIndex, yo, launchDate, landingDate) {
    var divH = 40;
    var divY = threads.yBase + yo - divH;
    var div = new TimeDiv(launchDate, landingDate, divY, divH);
    div.div.addEventListener("mouseenter", function (event) {
        //console.log(missionNameColumn[index]);
        event.target.style.backgroundColor = "yellow";
        event.target.style.opacity = "0.5";
    });
    div.div.addEventListener("mouseleave", function () {
        event.target.style.backgroundColor = null;
    });
    if (infoBoxIndex >= 0)
        div.div.addEventListener("click", function () { return showInfoBox(infoBoxIndex); });
    selectableBlocks.push(div);
}
function buildThreads() {
    //console.log("Building threads");
    missionNameColumn = missionData.table.getColumn(0);
    var dateLaunchColumn = missionData.table.getColumnByName("Launch date");
    var dateLandingColumn = missionData.table.getColumnByName("Landing date");
    var missionTypeColumn = missionData.table.getColumnByName("Mission type");
    var shuttle_topY = 100;
    var hubble_topY = 0;
    var iss_topY = 20;
    var mir_topY = 40;
    //console.log("svg: " + svg);
    // mir
    threads.add("#ff4466", [
        new Timestamp(new Date("February 20, 1986"), 300, 20),
        new Timestamp(new Date("23 March, 2001"), mir_topY, 20)
    ], "Mir", 1);
    // hubble
    threads.add("#77ff88", [
        new Timestamp(new Date("April 25, 1990"), shuttle_topY, 20),
        new Timestamp(new Date(), 0, 20)
    ], "Hubble", 1);
    // iss
    threads.add("#3388ff", [
        new Timestamp(new Date("20 Nov, 1998"), 300, 20),
        new Timestamp(new Date(), iss_topY, 20)
    ], "ISS", 1);
    //addSingleFlight("Vostok 1", "#ff0000", "April 12, 1961, 06:07 UTC", "April 12, 1961, 07:55 UTC", 40);
    //addSingleFlight("Vostok 2", "#ff0000", "August 6, 1961, 06:00 UTC", "August 7, 1961, 07:18 UTC", 20);
    //addSingleFlight("Apollo 11", "#3388ff", "July 16, 1969, 13:32:00 UTC", "July 24, 1969, 16:50:35 UTC", 20);
    flights.forEach(function (f) {
        var flight = new Flight(f);
        var ypos = 20;
        addSingleFlight(flight.name, "#ff8181", flight.launch.time, flight.landing.time, ypos);
        // missionTextBlocks.push(
        //     new TextBlock(flight.name, flight.launch.date, flight.landing.date, ypos, svg)
        // );
        addHoverRect(-1, ypos, flight.launch.date, flight.landing.date);
    });
    var spaceShuttleBlock = new TextBlock("Space Shuttle", new Date("1981-04-12 12:00:03"), new Date("2011-07-21 9:58"), 400, svg);
    spaceShuttleBlock.addRect(50, "#0000ff10");
    missionTextBlocks.push(spaceShuttleBlock);
    console.log(JSON.stringify(threads[0]));
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
            // Launch
            stamps.push(new Timestamp(launchDate, y, h));
            // Landing
            if (landStr != "")
                stamps.push(new Timestamp(landingDate, yo, ho));
            else {
                var yHalf = (y + yo) * 0.5;
                if (craft == "Challenger") {
                    var newDate = new Date(launchDate.getTime() + 73 * 1000);
                    stamps.push(new Timestamp(newDate, yHalf, ho));
                    landingDate = newDate;
                }
                else { // Columbia
                    var newDate = new Date(launchDate.getTime() + 15.8 * milisecondsInDay);
                    stamps.push(new Timestamp(newDate, yo, ho));
                    newDate = new Date(newDate.getTime() + 600000);
                    stamps.push(new Timestamp(newDate, yHalf, ho));
                    landingDate = newDate;
                }
                noEnd = true;
            }
            var textBlockY = threads.yBase + yo - 10;
            missionTextBlocks.push(new TextBlock(missionNameColumn[index], launchDate, landingDate, textBlockY, svg));
            var divH = 40;
            var divY = threads.yBase + yo - divH;
            var div = new TimeDiv(launchDate, landingDate, divY, divH);
            div.div.addEventListener("mouseenter", function (event) {
                console.log(missionNameColumn[index]);
                event.target.style.backgroundColor = "yellow";
                event.target.style.opacity = "0.5";
            });
            div.div.addEventListener("mouseleave", function () {
                event.target.style.backgroundColor = null;
            });
            div.div.addEventListener("click", function () { return showInfoBox(index); });
            selectableBlocks.push(div);
        });
        if (!noEnd)
            stamps.push(new Timestamp(new Date(), y, h));
        threads.add(colors[ci], stamps, craft); // new TextNode(craft, svg)
        ci++;
    });
    // Div block test
    {
        /*
        let _div = document.createElement("div");
        _div.classList.add("event-block");
        //_div.setAttribute("x", "100");
        //_div.setAttribute("y", "100");
        _div.style.width = "100px";
        _div.style.height = "100px";
        _div.style.top = "100px";
        _div.style.left = "100px";
        document.body.appendChild(_div);
        _div.addEventListener("mouseenter", function () {
            console.log("Entered");
        });
        */
    }
    missionTextBlocks.forEach(function (mtb) {
        mtb.unpend();
        mtb.append();
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
svg.addEventListener("wheel", onScroll);
svg.addEventListener("mousedown", onStartDrag);
//svg.addEventListener("click", hideInfoBox);
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
var TimeLevel;
(function (TimeLevel) {
    TimeLevel[TimeLevel["Decades"] = 0] = "Decades";
    TimeLevel[TimeLevel["Years"] = 1] = "Years";
    TimeLevel[TimeLevel["Months"] = 2] = "Months";
    TimeLevel[TimeLevel["Days"] = 3] = "Days";
    TimeLevel[TimeLevel["Hours"] = 4] = "Hours";
    TimeLevel[TimeLevel["Minutes"] = 5] = "Minutes";
    TimeLevel[TimeLevel["Seconds"] = 6] = "Seconds";
})(TimeLevel || (TimeLevel = {}));
var currentTimeLevel = TimeLevel.Decades;
var lastTimeLevel = currentTimeLevel;
var dateTexts = [];
var unusedDateTexts = [];
function getRulerTextBlock(startDate, endDate, text, yOff) {
    if (yOff === void 0) { yOff = 0; }
    if (unusedDateTexts.length > 0) {
        var _block = unusedDateTexts.splice(0, 1)[0];
        _block.append();
        _block.reset(startDate, endDate, text, yOff);
        dateTexts.push(_block);
        return _block;
    }
    else {
        var _block = new RulerTextBlock(text, startDate, endDate, yOff, svg);
        //_block.reset(startDate, endDate, text, yOff);
        dateTexts.push(_block);
        return _block;
    }
}
function releaseTextBlockAt(i) {
    var element = dateTexts.splice(i, 1)[0];
    unusedDateTexts.push(element);
    element.unpend();
}
function blockExists(milis, level) {
    return dateTexts.some(function (e) {
        return e.date.getTime() === milis &&
            e.yOff === level;
    });
}
function updateDateView() {
    // calculate day distance
    var t0 = getXFromDate(new Date(0));
    var t1 = getXFromDate(new Date(milisecondsInDay));
    var tdiff = t1 - t0;
    if (tdiff < 0.15) // show years
        currentTimeLevel = TimeLevel.Decades;
    else if (tdiff < 2.5)
        currentTimeLevel = TimeLevel.Years;
    else if (tdiff < 20)
        currentTimeLevel = TimeLevel.Months;
    else
        currentTimeLevel = TimeLevel.Days;
    // Check zoom level:
    //console.log(TimeLevel[currentTimeLevel] + ": " + tdiff);
    // Remove all unseen blocks
    for (var i = dateTexts.length - 1; i >= 0; i--) {
        var element = dateTexts[i];
        if (element.isInView())
            continue;
        releaseTextBlockAt(i);
    }
    // Release all blocks when changing states
    if (lastTimeLevel !== currentTimeLevel) {
        for (var i = dateTexts.length - 1; i >= 0; i--) {
            releaseTextBlockAt(i);
        }
    }
    var startDate = GetDateFromX(0);
    var endDate = GetDateFromX(ww);
    //console.log(startDate);
    //dateTexts.forEach(dt => console.log(dt.date));
    var startYear = startDate.getFullYear();
    var endYear = endDate.getFullYear() + 1;
    //console.log("-- START --");
    if (currentTimeLevel === TimeLevel.Decades) {
        // calculate visible blocks
        var startDecade = Math.floor(startYear / 10);
        var endDecade = Math.floor(endYear / 10);
        for (var d = startDecade; d <= endDecade; d++) {
            var text = d.toString() + "0";
            var decade = new Date(text);
            if (blockExists(decade.getTime(), 0))
                continue;
            var nextDecade = new Date((d + 1).toString() + "0");
            getRulerTextBlock(decade, nextDecade, text);
        }
    }
    else if (currentTimeLevel === TimeLevel.Years
        || currentTimeLevel === TimeLevel.Months
        || currentTimeLevel === TimeLevel.Days) {
        for (var y = startYear; y < endYear; y++) {
            var yearStr = y.toString();
            var year = new Date(yearStr);
            if (blockExists(year.getTime(), 0))
                continue;
            //if (dateTexts.some(e => e.node.text === yearStr))
            //continue;
            var nextYear = new Date((y + 1).toString());
            getRulerTextBlock(year, nextYear, yearStr);
        }
    }
    if (currentTimeLevel === TimeLevel.Months
        || currentTimeLevel === TimeLevel.Days) {
        var startMonth = 0;
        var endMonth = 12;
        for (var y = startYear; y < endYear; y++) {
            for (var m = startMonth; m < endMonth; m++) {
                var _date = new Date(y.toString());
                _date.setUTCMonth(m);
                if (blockExists(_date.getTime(), 1))
                    continue;
                var _endDate = new Date(_date);
                _endDate.setUTCMonth(m + 1);
                var monthName = _date.toLocaleString('default', { month: 'long' });
                getRulerTextBlock(_date, _endDate, monthName, 1);
            }
        }
    }
    if (currentTimeLevel === TimeLevel.Days) {
        var dateDiff = endDate.getTime() - startDate.getTime();
        var diffInDays = dateDiff / milisecondsInDay;
        diffInDays = Math.round(diffInDays);
        //console.log("Days: " + diffInDays);
        var startMilis = startDate.getTime();
        startMilis = Math.floor(startMilis / milisecondsInDay) * milisecondsInDay;
        var _startDay = new Date(startMilis);
        //console.log(_startDay);
        for (var d = 0; d <= diffInDays; d++) {
            // get day at start of 
            var _day = new Date(startMilis + milisecondsInDay * d);
            if (blockExists(_day.getTime(), 2))
                continue;
            var _endDay = new Date(startMilis + milisecondsInDay * (d + 1));
            getRulerTextBlock(_day, _endDay, _day.getUTCDate().toString(), 2);
        }
    }
    dateTexts.forEach(function (dt) { return dt.update(); });
    lastTimeLevel = currentTimeLevel;
    //console.log("zoomLevel: " + view.zoomLevel);
}
var currentDateNode = new TextNode("NOTHING", svg);
currentDateNode.setX(10).setY(20).update();
function updateMouseDate(mouseX) {
    var date = GetDateFromX(mouseX);
    var dd = date.getUTCDate();
    var mm = date.getUTCMonth() + 1;
    var yyyy = date.getUTCFullYear();
    var hh = date.getUTCHours();
    var m = date.getUTCMinutes();
    var s = date.getUTCSeconds();
    currentDateNode.updateText(mm + '/' + dd + '/' + yyyy + ' ' + hh + ':' + m + ':' + s);
}
//focusAll();
//repaint();
