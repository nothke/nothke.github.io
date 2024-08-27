"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var csvURL = "https://docs.google.com/spreadsheets/d/1T3-e6tCywND4s5K0HtBjPwJdwp_USsRCLa21hM9qrSM/pub?gid=0&single=true&output=csv";
var localCsvURL = "data/missions.tsv";
SheetsReader.getSheet(localCsvURL, onLoadCSV);
function onLoadCSV(txt) {
    var testt = new Table(SheetsReader.csvTo2dArray(txt, "\t"));
    //testt.debugData();
    var missionData = new MissionData();
    missionData.loadTSV(txt);
    //missionData.table.debugData();
    missionData.buildCraftMissionMap();
    missionData.debugCraftMissionMap();
}
