var GetFile;
(function (GetFile) {
    function read(url, callback) {
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
    GetFile.read = read;
})(GetFile || (GetFile = {}));
