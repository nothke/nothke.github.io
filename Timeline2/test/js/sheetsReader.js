var SheetsReader;
(function (SheetsReader) {
    function getSheet(url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200)
                    callback(xmlhttp.responseText);
                else if (xmlhttp.status > 299)
                    console.log('Server Error: ' + xmlhttp.statusText);
            }
        };
        xmlhttp.onerror = function () {
            console.log('xmlHTTP Error', xmlhttp.responseText);
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);
    }
    SheetsReader.getSheet = getSheet;
    function csvTo2dArray(csv, separator, trimWhitespace) {
        if (separator === void 0) { separator = ","; }
        if (trimWhitespace === void 0) { trimWhitespace = true; }
        var data = [];
        var rows = csv.split('\n');
        var rowsct = rows.length;
        for (var y = 0; y < rowsct; y++) {
            var values = rows[y].split(separator);
            data.push([]);
            for (var x = 0; x < values.length; x++) {
                data[y].push(values[x].trim());
            }
        }
        return data;
    }
    SheetsReader.csvTo2dArray = csvTo2dArray;
    function getCSVColumnByTitle(txt, columnTitle, separator) {
        if (separator === void 0) { separator = ','; }
        var row = txt.split('\n')[0];
        var tds = row.split(separator);
        var column = -1;
        for (var c = 0; c < tds.length; c++) {
            if (tds[c] == columnTitle) {
                column = c;
            }
        }
        if (column >= 0)
            return getCSVColumn(txt, column, separator);
        else
            throw "Column with title <" + columnTitle + "> not found in table";
    }
    SheetsReader.getCSVColumnByTitle = getCSVColumnByTitle;
    function getCSVColumn(txt, column, separator) {
        if (separator === void 0) { separator = ','; }
        var tds = null;
        var fin = [];
        var rows = txt.split('\n');
        for (var i = 0; i < rows.length; i++) {
            tds = rows[i].split(separator);
            for (var j = 0; j < tds.length; j++) {
                if (j == column && tds[j] != "") {
                    fin.push(tds[j]);
                }
            }
        }
        return fin;
    }
    SheetsReader.getCSVColumn = getCSVColumn;
})(SheetsReader || (SheetsReader = {}));
