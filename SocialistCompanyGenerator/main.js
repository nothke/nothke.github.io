var prefixes = [];
var suffixes = [];

var ready = false;

var localCsvPath = "SocComGen_names.csv";
var sheetsCsvPath = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQq8sDTpUlOGfEr_NSGTslrvP36A7J1nZ1NkE1UNbv5j6RuN5yi8yF1S8HI9CKioGHXEkOpNxvJ7k-a/pub?output=csv"

$(document).ready(function () {
	var data;

	$.ajax({
		type: 'GET',
		url: sheetsCsvPath,
		data: data,
		dataType: 'text',
		success: getSuccess,
		error: getError
	});
});

function getSuccess(data) {
	console.log("Succeeded getting remote csv");

	if (!data) {
		console.log("Remote csv is empty");
		loadLocalCSV(data);
		return;
	}

	// TODO: Catch bad csv error?
	loadWordsFromCSV(data);
	ready = true;

	console.log("Successfully loaded data from remote csv");
}

function getError() {
	console.log("GET error detected");
	loadLocalCSV();
}

function loadWordsFromJson(data) {
	var rows = data.feed.entry;

	prefixes = [];
	suffixes = [];

	for (var i = 0; i < rows.length; i++) {
		var prefix = rows[i].gsx$prefix.$t;
		var suffix = rows[i].gsx$suffix.$t;

		if (prefix) prefixes.push(prefix);
		if (suffix) suffixes.push(suffix);
	}

	ready = true;

	setText();
}

function getCSVColumn(txt, column) {
	tds = null;

	var rows = txt.split('\n');

	var fin = [];

	for (var i = 0; i < rows.length; i++) {

		tds = rows[i].split(',');

		for (var j = 0; j < tds.length; j++) {
			if (j == column && tds[j] != "") {
				fin.push(tds[j]);
			}
		}
	}
	return fin;
}

function loadWordsFromCSV(text) {
	prefixes = getCSVColumn(text, 0);
	suffixes = getCSVColumn(text, 1);

	setText();
}

function loadLocalCSV() {
	GetCSV(localCsvPath, function (text) {
		loadWordsFromCSV(text);
		ready = true;

		console.log("Successfully loaded data from local csv");
	});
}

function GetCSV(url, callback) {

	xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			callback(xmlhttp.responseText);
		}
	}
	xmlhttp.open('GET', url, true);
	xmlhttp.send(null);
}

function GetRandom(collection) {
	return collection[Math.floor((Math.random() * collection.length))];
}

function setText() {
	document.getElementById("p1").innerHTML = GetRandom(prefixes) + GetRandom(suffixes);
}

document.getElementById("mainBody").onclick = butClick;

function butClick() {
	if (ready)
		setText();
}
