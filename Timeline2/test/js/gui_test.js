var GUIParams = function () {
    this.message = 'dat.gui';
    this.speed = 0.8;
    this.displayOutline = false;
};

window.onload = function() {
    var params = new GUIParams();
    var gui = new dat.GUI();
    gui.add(params, 'message');
    gui.add(params, 'speed', -5, 5);
    gui.add(params, 'displayOutline');
    
    gui.domElement.setAttribute("height", 1000);

    //document.body.appendChild(gui.domElement);
};
