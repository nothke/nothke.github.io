//export { }
var Table = /** @class */ (function () {
    function Table(data) {
        this.data = data;
    }
    Table.prototype.getValueInRowByName = function (rowIndex, columnName) {
        var row = this.data[rowIndex];
        var colct = row.length;
        for (var x = 0; x < colct; x++) {
            if (this.data[0][x] == columnName)
                return this.data[rowIndex][x];
        }
        throw "Column with title " + columnName + " doesn't exist";
    };
    Table.prototype.getColumnByName = function (name) {
        var firstRow = this.data[0];
        //console.log("Looking for column!");
        var colct = this.data.length;
        for (var x = 0; x < colct; x++) {
            //console.log("|" + firstRow[x] + "|");
            if (firstRow[x] == name)
                return this.getColumn(x);
        }
        throw "Column with title " + name + " doesn't exist";
    };
    Table.prototype.getColumn = function (index) {
        var column = [];
        var rowct = this.data.length;
        for (var y = 0; y < rowct; y++) {
            column.push(this.data[y][index]);
        }
        return column;
    };
    Table.prototype.getRow = function (index) {
        return this.data[index];
    };
    Table.prototype.getRowByName = function (name) {
        var rowct = this.data.length;
        for (var i = 0; i < rowct; i++) {
            var rowName = this.data[i][0];
            if (rowName == name)
                return this.data[i];
        }
        throw "Row with title " + name + " doesn't exist";
    };
    Table.prototype.debugData = function () {
        this.data.forEach(function (row) {
            var str = "";
            row.forEach(function (value) {
                str += value + ", ";
            });
            str = str.substr(0, str.length - 2);
            console.log(str);
        });
    };
    return Table;
}());
