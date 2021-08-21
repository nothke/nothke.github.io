
var prefixes = [];
var suffixes = [];

var english_prefixes = [];
var english_suffixes = [];

var ready = false;

var localCsvPath = "town_names.csv";
var remoteCsvPath = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTYofS1PUv73RJkA2zmDirEN5BNDzGjSnaWOgEXYmn6FyIcOEq5cGn5fBejIru_YLusZTrNMDphUjG/pub?output=csv";

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
	prefixes = getCSVColumn(text, 0);
	suffixes = getCSVColumn(text, 2);

	english_prefixes = getCSVColumn(text, 1);
	english_suffixes = getCSVColumn(text, 3);

	setText();
}

function GetRandom(collection) {
	return collection[1 + Math.floor((Math.random() * (collection.length - 1)))];
}

function setText() {
	var i1 = 1 + Math.floor((Math.random() * (prefixes.length - 1)));
	var i2 = 1 + Math.floor((Math.random() * (suffixes.length - 1)));

	var name = prefixes[i1] + suffixes[i2];
	name = name.toUpperCase();
	document.getElementById("p1").innerHTML = name;

	document.getElementById("translation_text").innerHTML = english_prefixes[i1] + " " + english_suffixes[i2];
}

document.getElementById("mainBody").onclick = butClick;

function butClick() {
	if (ready)
		setText();
}
