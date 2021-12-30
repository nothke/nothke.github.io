function requestCSV(url, successCallback, failCallback) {
    var data;

    $.ajax({
        type: 'GET',
        url: url,
        data: data,
        dataType: 'text',
		success: successCallback,
        error: failCallback
    });
}

function getCSVColumn(txt, column) {
	var tds = null;

	var rows = txt.split('\n');

	var fin = [];

	for (var i = 0; i < rows.length; i++) {

		tds = rows[i].split(',');

		for (var j = 0; j < tds.length; j++) {
			tds[j] = tds[j].trim();

			if (j == column && tds[j] != "") {
				fin.push(tds[j]);
			}
		}
	}
	return fin;
}