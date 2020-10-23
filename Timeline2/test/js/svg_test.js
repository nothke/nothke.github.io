var draw = SVG().addTo('body');
//draw.rect(100, 100).move(100, 50).fill('#f06');

var y0 = 100;
var y1 = 0;
var bot_h = 20;
var top_h = 50;

var curvw = 20;
bezwMult = 0.7;
bezOffset = 3;
bezw = curvw * bezwMult;

var scale = 1;

threads = []

function createRandomSegs(count = 10) {
    segs = [];
    var x = 0;
    for (let i = 1; i < count; i++) {
        x += (1 + (-0.5 + Math.random() * 1.5)) * (i % 2 == 0 ? 50 : 200);
        segs.push(x);
    }
    return segs;
}

threads.push({
    y: 100,
    topY: 0,
    color: "#f06",
    segs: createRandomSegs(10)
});

threads.push({
    y: 120,
    topY: 20,
    color: "#2299ff",
    segs: createRandomSegs(100)
});

threads.push({
    y: 140,
    topY: 40,
    color: "#22ff99",
    segs: createRandomSegs()
});

// Create path for each thread
threads.forEach(t => {
    t.path = draw.path("");
    t.path.stroke({ color: '#ffffff', width: 2, linecap: 'round', linejoin: 'round' })
    t.path.fill(t.color);
    //t.path.move(100, 100);
})

function repaint() {
    threads.forEach(thread => {
        var isBez = true;

        segs = thread.segs;

        pth = "";

        _y0 = y0;
        _y1 = y1 - thread.topY;

        pth = ["M", 0, y0];
        for (let i = 0; i < segs.length - 1; i++) {
            const seg = segs[i];
            const y = isBez ? _y0 : _y1;
            const yo = isBez ? _y1 : _y0;
            const xoff = isBez ? bezOffset : -bezOffset;// isBez ? bezOffset : 0;

            const x = segs[i] * scale + xoff;

            pth.push(
                "L",
                x, y,
                "C",
                x + bezw, y,
                x + curvw - bezw, yo,
                x + curvw, yo
            );

            isBez = !isBez;
        }

        // Ending
        var yEnd = isBez ? y0 : y1;
        var hEnd = isBez ? bot_h : top_h;
        pth.push("L", segs[segs.length - 1] * scale, yEnd);
        pth.push("L", segs[segs.length - 1] * scale, yEnd - hEnd);

        // Return line
        for (let i = segs.length - 2; i >= 0; i--) {
            const element = segs[i];
            const h = isBez ? bot_h : top_h;
            const ho = isBez ? top_h : bot_h;
            const y = (isBez ? _y0 : _y1) - h;
            const yo = (isBez ? _y1 : _y0) - ho;

            const x = segs[i] * scale;

            pth.push(
                "L",
                x + curvw, y,
                "C",
                x - bezw + curvw, y,
                x - curvw + bezw + curvw, yo,
                x - curvw + curvw, yo
            );

            isBez = !isBez;
        }

        pth.push("L", 0, yEnd - bot_h, "Z");

        // Assemble string
        var path_str = "";
        pth.forEach(str => {
            path_str += str + " ";
        });

        // Set path
        thread.path.plot(pth);
        thread.path.move(100, 100);
    });
}

//var path = draw.path('M 0 0 0 100 100 100 C 200 100 300 0 400 0 z');
//var textpath = path.text('SVG.js rocks!')

function update() {
    var now = new Date();
    curvw = (1 + Math.sin(now.getTime() * 0.01)) * 20;
    bezw = curvw * bezwMult;
    repaint();
    setTimeout(update, 1.0 / 60);
}

repaint();
//update();

function recalc() {
    bezw = curvw * bezwMult;
}

function onGUI() {
    bezwMult = params.bezwMult;
    scale = params.scale;
    curvw = params.curvw;
    recalc();
    repaint();
}

var GUIParams = function () {
    this.bezwMult = bezwMult;
    this.scale = scale;
    this.curvw = curvw;
};

var gui = new dat.GUI();
var params = new GUIParams();
gui.add(params, 'bezwMult', 0, 1).onChange(onGUI);
gui.add(params, 'scale').onChange(onGUI);
gui.add(params, 'curvw', 0, 50).onChange(onGUI);