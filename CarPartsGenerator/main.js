var imenice = [];
var imenice_rod = []
var imenice_instrumental = [];
var pridevi = [];

var ready = false;

var localCsvPath = "names.csv";
var remoteCsvPath = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRwG2wqQ8DmY6wf7gSatilDqqpasjBLjawthZwCkxtJx3sbXKBbMrFbWULy2R2mEDepJUXgdkCBEN8D/pub?output=csv";

$(document).ready(function () {
	requestCSV(remoteCsvPath,
		(data) => { // Success
			console.log("Success");
			loadWordsFromCSV(data);
			enable();
		},
		(data) => { // Fail
			requestCSV(localCsvPath, (data) => {
				loadWordsFromCSV(data) // Success

				console.log("Loaded from local csv");
				enable();
			});
		})
});

function enable() {
	$("p#loading").hide();
	$("div#sign").show();
	ready = true;
}

function loadWordsFromCSV(text) {
	imenice = getCSVColumn(text, 0);
	imenice_rod = getCSVColumn(text, 1);
	imenice_instrumental = getCSVColumn(text, 2);

	pridevi = getCSVColumn(text, 3);

	//console.log(pridevi);

	setText();
}

function GetRandom(collection) {
	return collection[1 + Math.floor((Math.random() * (collection.length - 1)))];
}

function GetRandomIndex(collection) {
	return 1 + Math.floor((Math.random() * (collection.length - 1)));
}

function trunc(str) {
	return str.substring(0, str.length - 1);
}

function GetImenicom(imenica_index) { 
	var rod = imenice_rod[imenica_index];

	var m = imenice[imenica_index];

	if (rod == 'm')
		return m + "om";
	else return trunc(m) + "om";
}

function GetPridevFor(imenica_index, pridev_index, om = false) {
	var rod = imenice_rod[imenica_index];

	var m = pridevi[pridev_index];

	if (m.endsWith('-'))
		return m;

	if (rod == 'm') {
		if (!om)
			return pridevi[pridev_index] + " ";
		else return trunc(m) + "im ";
	}
	else if (rod == 'f') {
		if (!om)
			return m.substring(0, m.length - 1) + "a ";
		else return trunc(m) + "om ";
	}
	else {
		if (!om)
			return m.substring(0, m.length - 1) + "o ";
		else return trunc(m) + "im ";
	}
}

function setText() {
	var i1 = GetRandomIndex(imenice);
	var i2 = GetRandomIndex(imenice);

	var p1 = GetRandomIndex(pridevi);
	var p2 = GetRandomIndex(pridevi);

	var name = GetPridevFor(i1, p1) + imenice[i1] + " sa " + GetPridevFor(i2, p2, true) + imenice_instrumental[i2];
	
	//console.log(name);

	//name = name.toUpperCase();

	document.getElementById("p1").innerHTML = name;

	//document.getElementById("translation_text").innerHTML = english_prefixes[i1] + " " + english_suffixes[i2];
}

document.getElementById("mainBody").onclick = butClick;

function butClick() {
	if (ready)
		setText();
}
