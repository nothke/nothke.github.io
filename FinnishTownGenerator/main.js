
var prefixes = [];
var suffixes = [];

var ready = false;

var localCsvPath = "town_names.csv";
var remoteCsvPath = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTYofS1PUv73RJkA2zmDirEN5BNDzGjSnaWOgEXYmn6FyIcOEq5cGn5fBejIru_YLusZTrNMDphUjG/pub?output=csv";

$(document).ready(function () {
	requestCSV(remoteCsvPath,
		(data) => { // Success
			console.log("Success");
			loadWordsFromCSV(data);
			ready = true;
		},
		(data) => { // Fail
			requestCSV(localCsvPath, (data) => {
				loadWordsFromCSV(data) // Success

				console.log("Loaded from local csv");
				ready = true;
			});
		})
});

function loadWordsFromCSV(text) {
	prefixes = getCSVColumn(text, 0);
	suffixes = getCSVColumn(text, 2);

	setText();
}

function GetRandom(collection) {
	return collection[1 + Math.floor((Math.random() * (collection.length - 1)))];
}

function setText() {
	var name = GetRandom(prefixes) + GetRandom(suffixes);
	name = name.toUpperCase();
	document.getElementById("p1").innerHTML = name;
}

document.getElementById("mainBody").onclick = butClick;

function butClick() {
	if (ready)
		setText();
}
