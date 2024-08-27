var MissionData = /** @class */ (function () {
    function MissionData() {
    }
    MissionData.prototype.loadTSV = function (txt) {
        this.table = new Table(SheetsReader.csvTo2dArray(txt, '\t'));
    };
    MissionData.prototype.buildCraftMissionMap = function () {
        var craftColumn = this.table.getColumnByName("Spacecraft");
        this.craftMissionMap = new Map();
        for (var i = 1; i < craftColumn.length; i++) {
            var craft = craftColumn[i];
            //spacecraftColumn[i];
            if (this.craftMissionMap.has(craft))
                this.craftMissionMap.get(craft).push(i);
            else {
                var missions = [i];
                this.craftMissionMap.set(craft, missions);
            }
        }
    };
    MissionData.prototype.debugCraftMissionMap = function () {
        // Debug
        console.log("Found craft-mission pairs: ");
        this.craftMissionMap.forEach(function (value, key) {
            var missionsStr = key + ", (" + value.length + "): ";
            value.forEach(function (mission) {
                missionsStr += mission + ", ";
            });
            console.log(missionsStr);
        });
    };
    return MissionData;
}());
