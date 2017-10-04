var debris = [];

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, -10, 10);
camera.lookAt(new THREE.Vector3(0, 2, 0));
camera.position.y = -6;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var texture = new THREE.TextureLoader().load("textures/flare.png");

var geometry = new THREE.BoxGeometry(1, 1, 1);
var flareMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    color: 0xffffff,
    //wireframe: true,
    //vertexColors: THREE.VertexColors,
    blending: THREE.AdditiveBlending
});

var textureTail = new THREE.TextureLoader().load("textures/edge.png");

var tailMaterial = new THREE.MeshBasicMaterial({
    map: textureTail,
    transparent: true,
    depthWrite: false,
    color: 0xffffff,
    //wireframe: true,
    //vertexColors: THREE.VertexColors,
    blending: THREE.AdditiveBlending
});

var material = new THREE.MeshBasicMaterial({
    transparent: true,
    //map: texture,
    //depthWrite: false,
    //color: 0xffffff,
    //wireframe: true,
    vertexColors: THREE.VertexColors,
    blending: THREE.AdditiveBlending
});

//material.blending = THREE.AdditiveBlending;

var cube = new THREE.Mesh(geometry, material);
//scene.add( cube );

function CreateQuad() {
    var quad = new THREE.Geometry();
    quad.vertices.push(new THREE.Vector3(-1.0, 1.0, 0.0));
    quad.vertices.push(new THREE.Vector3(1.0, 1.0, 0.0));
    quad.vertices.push(new THREE.Vector3(1.0, -1.0, 0.0));
    quad.vertices.push(new THREE.Vector3(-1.0, -1.0, 0.0));

    quad.faceVertexUvs[0].push([
        new THREE.Vector2(0, 1),
        new THREE.Vector2(1, 0),
        new THREE.Vector2(1, 1),
    ]);

    quad.faceVertexUvs[0].push([
        new THREE.Vector2(0, 1),
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1, 0),
    ]);

    quad.faces.push(new THREE.Face3(0, 2, 1));
    quad.faces.push(new THREE.Face3(0, 3, 2));

    return quad;
}

var gradient = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xFF8E00),
    new THREE.Color(0xFF6113),
    new THREE.Color(0xF89483),
    new THREE.Color(0xF89483),
    new THREE.Color(0xF89483),
    new THREE.Color(0xF89483),
    new THREE.Color(0xF89483),
    new THREE.Color(0x000000),
    new THREE.Color(0x000000),
    new THREE.Color(0x000000),
]

gradient[2].multiplyScalar(0.3);
gradient[3].multiplyScalar(0.2);
gradient[4].multiplyScalar(0.05);
gradient[5].multiplyScalar(0.03);
gradient[6].multiplyScalar(0.01);
gradient[7].multiplyScalar(0.01);

var STRIP_LENGTH = 0.05;
var STRIP_WIDTH = 0.1;

function CreateStrip() {
    var strip = new THREE.Geometry();
    for (i = 0; i < 10; i++) {
        var h = Math.pow(i, 2) * STRIP_LENGTH;
        var w = 1 + i * 0.5;
        strip.vertices.push(new THREE.Vector3(-1.0 * STRIP_WIDTH * w, i * 2 * h, 0.0));
        strip.vertices.push(new THREE.Vector3(1.0 * STRIP_WIDTH * w, i * 2 * h, 0.0));
    }

    //var color = new THREE.Color(0xffffff);
    //color.setHex(Math.random() * 0xffffff);

    for (i = 0; i < 9; i++) {

        var o = i * 2;
        var face1 = new THREE.Face3(o + 0, o + 1, o + 2);
        var face2 = new THREE.Face3(o + 1, o + 3, o + 2);

        face1.vertexColors[0] = gradient[i];
        face1.vertexColors[1] = gradient[i];
        face2.vertexColors[0] = gradient[i];

        face1.vertexColors[2] = gradient[i + 1];
        face2.vertexColors[1] = gradient[i + 1];
        face2.vertexColors[2] = gradient[i + 1];

        var f = i / 9.0;
        var fn = (i + 1) / 9.0;

        strip.faceVertexUvs[0].push([
            new THREE.Vector2(f, 0),
            new THREE.Vector2(f, 1),
            new THREE.Vector2(fn, 0)
        ])

        strip.faceVertexUvs[0].push([
            new THREE.Vector2(f, 0),
            new THREE.Vector2(fn, 0),
            new THREE.Vector2(fn, 1),
        ]);

        /*
        face1.faceVertexUvs[0] = new THREE.Vector2(f, 0);
        face1.faceVertexUvs[1] = new THREE.Vector2(f, 1);
        face2.faceVertexUvs[0] = new THREE.Vector2(f, 1);

        face1.faceVertexUvs[2] = new THREE.Vector2(fn, 1);
        face2.faceVertexUvs[1] = new THREE.Vector2(fn, 0);
        face2.faceVertexUvs[2] = new THREE.Vector2(fn, 1);
        */

        strip.faces.push(face1);
        strip.faces.push(face2);
    }

    return strip;
}

var flare = CreateQuad();
var strip = CreateStrip();

// Ticks it takes to split
var MIN_TENSION = 50;
var MAX_TENSION = 100;

// Ticks till debris starts dying
var MIN_LIFETIME = 300;
var MAX_LIFETIME = 1000;

var MAX_VELOCITY = 0.01;

function CreateDebrisPiece(position, velocity, generation) {

    var flareMesh = new THREE.Mesh(flare, flareMaterial);
    var stripMesh = new THREE.Mesh(strip, tailMaterial);

    flareMesh.position.set(position.x, position.y, position.z);
    stripMesh.position.set(position.x, position.y, position.z);

    flareMesh.scale.set(1, 1, 1);

    scene.add(flareMesh);
    scene.add(stripMesh);

    var piece = {
        flare: flareMesh,
        strip: stripMesh,
        position: position,
        velocity: velocity,
        eternal: false,
        lifetime: 0,
        deathtime: randomDeathtime(),
        generation: generation,
        weight: 100,
        tension: randomTension()
    }

    debris.push(piece);
}

function randomVelocity() {
    return new THREE.Vector3(
        (-0.5 + Math.random()) * MAX_VELOCITY,
        (Math.random()) * MAX_VELOCITY / 2,
        (-0.5 + Math.random()) * MAX_VELOCITY,
    );
}

function randomTension() {
    return MIN_TENSION + Math.random() * MAX_TENSION;
}

function randomDeathtime() {
    return MIN_LIFETIME + Math.random() * MAX_LIFETIME;
}

function smootherstep(min, max, value) {
    return smoothstep(min, max, smoothstep(min, max, smoothstep(min, max, value)));
}

function smoothstep(min, max, value) {
    var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
};

var INFLATION_SPEED = 0.005;

var MAX_GENERATIONS = 3;

function UpdateDebris() {
    for (var i = 0; i < debris.length; i++) {
        var d = debris[i];

        d.flare.quaternion.copy(camera.quaternion);

        var brightness = d.lifetime * INFLATION_SPEED;

        brightness = smootherstep(0, 1, brightness);

        var isAlive = d.lifetime < d.deathtime;

        if (!d.eternal && d.lifetime > d.deathtime) {
            var lifeLeft = d.lifetime - d.deathtime;

            brightness = 1 - lifeLeft * 0.003;
        }

        if (brightness < 0) {
            scene.remove(debris[i]);
            debris.splice(i, 1);
            continue;
        }

        brightness = Clamp(brightness, 0, 1);

        brightness *= 0.5;

        d.strip.scale.x = brightness;
        d.flare.scale.set(brightness, brightness, brightness);


        if (d.generation != 0 && d.lifetime == 200)
            d.velocity = randomVelocity().add(d.velocity);

        d.position.add(d.velocity);
        d.strip.position.set(d.position.x, d.position.y, d.position.z);
        d.flare.position.set(d.position.x, d.position.y, d.position.z);

        if (d.generation < MAX_GENERATIONS && d.tension < 0 && isAlive) {
            //var randchildren = Math.ceil(Math.random() * 2);
            //for (var i = 0; i < randchildren; i++) {
            CreateDebrisPiece(
                new THREE.Vector3(d.position.x, d.position.y, d.position.z),
                d.velocity,
                d.generation + (1 + Math.round(Math.random() * 1)));
            //}

            d.tension = randomTension();
        }

        /*
        if (d.lifetime == 200) {
            CreateDebrisPiece(d.position, randomVelocity());
        }*/

        d.tension--;
        d.lifetime++;
    }

    //console.log(debris.length);
}

CreateDebrisPiece(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), 0);
debris[0].eternal = true;
//CreateDebrisPiece(new THREE.Vector3(2, 0, 2), new THREE.Vector3(0, 0, 0.01));

function Clamp(a, b, c) { return Math.max(b, Math.min(c, a)); }

var s = 0;

var lastTime = 0;

var ticks = 0;

var animate = function () {
    requestAnimationFrame(animate);

    ticks++;

    if (ticks > 1000 && debris.length == 1) {
        CreateDebrisPiece(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), 0);
    }

    /*
    if (ticks > 200) {

        CreateDebrisPiece(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(
                (-0.5 + Math.random()) * 0.02,
                (Math.random()) * 0.01,
                (-0.5 + Math.random()) * 0.02,
            ));

        CreateDebrisPiece(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(
                (-0.5 + Math.random()) * 0.02,
                (Math.random()) * 0.01,
                (-0.5 + Math.random()) * 0.02,
            ));

        ticks = 0;
    }*/



    //line.geometry.vertices[0] = new THREE.Vector3(0, Math.sin(s) * 5, 0);
    //line.geometry.verticesNeedUpdate = true;
    //geometry.vertices[0] = new THREE.Vector3(0, Math.sin(s) * 5, 0);

    //cube.rotation.x += 0.1;
    s += 0.02;
    //camera.rotation.y = Math.sin(s) * 0.02;



    //stripMesh.position.x += 0.1;

    //quadMesh.scale.set(sins, sins, sins);

    UpdateDebris();

    renderer.render(scene, camera);
};

animate();

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}