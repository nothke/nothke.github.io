"use strict";
exports.__esModule = true;
//var csvURL = "https://docs.google.com/spreadsheets/d/1T3-e6tCywND4s5K0HtBjPwJdwp_USsRCLa21hM9qrSM/pub?gid=0&single=true&output=csv";
var localCsvURL = "data/missions.tsv";
SheetsReader.getSheet(localCsvURL, onLoadCSV);
function onLoadCSV(txt) {
    var missionNames = SheetsReader.getCSVColumnByTitle(txt, "Mission", '\t');
    missionNames.forEach(function (title) {
        console.log(title);
    });
}
