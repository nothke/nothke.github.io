
var prefixes = [];
var suffixes = [];

var ready = false;

//var csvPath = "https://docs.google.com/spreadsheets/d/1T3-e6tCywND4s5K0HtBjPwJdwp_USsRCLa21hM9qrSM/pub?gid=0&single=true&output=csv"
var csvPath = "SocComGen_names.csv";

//https://docs.google.com/spreadsheets/d/e/2PACX-1vQq8sDTpUlOGfEr_NSGTslrvP36A7J1nZ1NkE1UNbv5j6RuN5yi8yF1S8HI9CKioGHXEkOpNxvJ7k-a/pubhtml
//https://spreadsheets.google.com/feeds/cells/SPREADSHEET_ID/TAB_NUMBER/public/values?alt=json
var jsonPath = "https://spreadsheets.google.com/feeds/list/1yXXN2WNoub0L56LAJP3VnWy35-F8ltlXN5Dh9OmLqH8/od6/public/values?alt=json&callback=dataCallback";

$(document).ready(function() {
	$.ajax({
		type: 'GET',
		dataType: 'jsonp',
		url: jsonPath, //"testJson.js",
		jsonpCallback: 'dataCallback',
	}).then(
		function(){ console.log("FTG: Succeded retrieving JSONP file " + jsonPath)} ,
		function(){
			console.log("FTG: Failed retrieving JSONP file, reading .csv");
			loadData();
		})
});

function dataCallback( data ) {
	var rows = data.feed.entry;

	prefixes = [];
	suffixes = [];

	console.log(rows[0]);

	for (var i = 0; i < rows.length; i++) {
		var prefix = rows[i].gsx$firstword.$t;
		var suffix = rows[i].gsx$secondword.$t;

		if (prefix) prefixes.push(prefix);
		if (suffix) suffixes.push(suffix);
	}

	ready = true;

	setText();
}

function getCSVColumn( txt, column )
{
	tds = null;

	var rows = txt.split('\n');

	var fin = [];

	for ( var i = 0; i < rows.length; i++ ) {

		tds = rows[i].split(',');

		for ( var j = 0; j < tds.length; j++ ) {
			if (j == column && tds[j] != "")
			{
				fin.push(tds[j]);
			}
		}
	}
	return fin;
}


function loadData() {
	var url = csvPath;
	xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status==200){
			ready = true;
			prefixes = getCSVColumn(xmlhttp.responseText, 0);
			suffixes = getCSVColumn(xmlhttp.responseText, 1);

			setText();
		}
	};
	xmlhttp.open("GET",url,true);
	xmlhttp.send(null);
}

//loadData();



function GetRandom(collection) {
	return collection[Math.floor((Math.random() * collection.length))];
}

function setText() {
	var name = GetRandom(prefixes) + GetRandom(suffixes);
	name = name.charAt(0).toUpperCase() + name.slice(1);
	document.getElementById("p1").innerHTML = name;
}

document.getElementById("mainBody").onclick = butClick;

function butClick() {
	if (ready)
	setText();
}
