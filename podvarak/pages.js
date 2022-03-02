var links = [
    "https://twitter.com/Nothke/status/1484912864578129924",
    "https://twitter.com/Nothke/status/1480311526493986818",

    "https://twitter.com/Nothke/status/1353134133040582656",
    "https://twitter.com/Nothke/status/1332839521008963584",
    "https://twitter.com/Nothke/status/1332087563180519427",


    // nov
    "https://twitter.com/Nothke/status/1332839521008963584",
    "https://twitter.com/Nothke/status/1332087563180519427",
    "https://twitter.com/Nothke/status/1330648347359768576", // nov 23
    "https://twitter.com/Nothke/status/1330651494652272641",
    "https://twitter.com/Nothke/status/1330633203095384066",
    "https://twitter.com/Nothke/status/1329936346992041985",
    "https://twitter.com/Nothke/status/1330274192256880640",
    "https://twitter.com/Nothke/status/1328517770275921920",
    "https://twitter.com/Nothke/status/1327741950951297026", // nov 14
    "https://twitter.com/Nothke/status/1327477473488084993",
    "https://twitter.com/Nothke/status/1327386735668588544",
    //"https://twitter.com/Nothke/status/1327027412295626757" // neo
    "https://twitter.com/Nothke/status/1326660481864622081",
    "https://twitter.com/Nothke/status/1326634625318477824", // crnogorac
    "https://twitter.com/Nothke/status/1326596712325115904",
    "https://twitter.com/Nothke/status/1326550697316282381",
    "https://twitter.com/Nothke/status/1326548245498064896",
    "https://twitter.com/Nothke/status/1326303086709792774",
    "https://twitter.com/Nothke/status/1324837619772129281",
    "https://twitter.com/Nothke/status/1322564777487597568",
    "https://twitter.com/Nothke/status/1322564777487597568", // overcast photos
    "https://twitter.com/Nothke/status/1322607552044113920",
    "https://twitter.com/Nothke/status/1320397342579871747",
    "https://twitter.com/Nothke/status/1320126377367097349",
    "https://twitter.com/Nothke/status/1319774270042624001",
    "https://twitter.com/Nothke/status/1319016514289356801",
    "https://twitter.com/Nothke/status/1319016514289356801", // pathfinding
    //"https://twitter.com/Nothke/status/1318245888410722304",
    "https://twitter.com/Nothke/status/1318175874122977290",
    "https://twitter.com/Nothke/status/1317878786948534280", // fence
    "https://twitter.com/Nothke/status/1317638210500034560",
    "https://twitter.com/Nothke/status/1317511849018052610", // mood
    "https://twitter.com/Nothke/status/1317225264053706763",
    "https://twitter.com/Nothke/status/1317198537487192070",
    "https://twitter.com/Nothke/status/1316777910032891905",
    "https://twitter.com/Nothke/status/1316768216224542721",
    "https://twitter.com/Nothke/status/1316469110868451328",
    "https://twitter.com/Nothke/status/1315796828684791809",
    "https://twitter.com/Nothke/status/1315782569607278599",
    "https://twitter.com/Nothke/status/1315745349894582273",
    "https://twitter.com/Nothke/status/1315240016231030786", // notepad
    "https://twitter.com/Nothke/status/1314994543733940226",
    "https://twitter.com/Nothke/status/1314711452641644548",
    "https://twitter.com/Nothke/status/1314686134555996161", // ref2
    "https://twitter.com/Nothke/status/1314647883140956168", // ref1
    "https://twitter.com/Nothke/status/1314321220008120321",
    "https://twitter.com/Nothke/status/1314184353904316417",
    "https://twitter.com/Nothke/status/1313961173986037764",
    "https://twitter.com/Nothke/status/1313555349320986626",
    "https://twitter.com/Nothke/status/1313236625728720896", // house gen white tower
    "https://twitter.com/Nothke/status/1312875837977513989",
    "https://twitter.com/Nothke/status/1312863027914592258",
    "https://twitter.com/Nothke/status/1312834802559651842",
    "https://twitter.com/Nothke/status/1312826326269689863",
    "https://twitter.com/Nothke/status/1312573173301420032", // back to school
    "https://twitter.com/Nothke/status/1312044337002434561", // crows
]

var jqxhr;

function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

function embed(url) {
    return $.get("https://publish.twitter.com/oembed?url=" + url + "&theme=dark", function (data) {
        //console.log("success");
        //console.log(data.html)

        data.html = insert(data.html, 32, " tw-align-center")
        console.log(data.html)

        $("body").append(data.html)
    })
}

function embed_tweet(url) {
    if (!jqxhr)
        jqxhr = embed(url)
    else
        jqxhr = jqxhr.then(embed(url))
}

$(document).ready(function () {

    for (let i = 0; i < links.length; i++) {
        const element = links[i];
        setTimeout(() => {
            embed_tweet(element)
        }, i * 1000);
    }
});
