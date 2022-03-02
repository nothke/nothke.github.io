var links = [
    "https://twitter.com/Nothke/status/1484912864578129924",
    "https://twitter.com/Nothke/status/1480311526493986818",


    "https://twitter.com/Nothke/status/1353134133040582656",
    "https://twitter.com/Nothke/status/1332839521008963584",
    "https://twitter.com/Nothke/status/1332087563180519427"
]

var jqxhr;

function embed(url) {
    return $.get("https://publish.twitter.com/oembed?url=" + url, function (data) {
        console.log("success");
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


    var jqxhr = $.get("https://publish.twitter.com/oembed?url=https://twitter.com/Interior/status/463440424141459456", function (data) {
        console.log("success");
        console.log(data.html)
        $("body").append(data.html)
    })

    links.forEach(link => {
        embed_tweet(link)
    });

    // const txt = $.get("https://publish.twitter.com/oembed?url=https://twitter.com/Interior/status/463440424141459456", funcition(data) {
    //     console.log("Done")
    // })
    // $("body").append(txt)
    // console.log(txt)

    document.body.append("huthut")

    $("body").append(`
    <blockquote class="twitter-tweet tw-align-center" data-theme="dark">
            <p lang="en" dir="ltr">A few new &quot;very important&quot; props for <a
                    href="https://twitter.com/hashtag/Podvarak?src=hash&amp;ref_src=twsrc%5Etfw">#Podvarak</a>. <a
                    href="https://twitter.com/hashtag/screenshotsaturday?src=hash&amp;ref_src=twsrc%5Etfw">#screenshotsaturday</a>
                <a href="https://twitter.com/hashtag/b3d?src=hash&amp;ref_src=twsrc%5Etfw">#b3d</a> <a
                    href="https://t.co/SOyM3rHHFU">pic.twitter.com/SOyM3rHHFU</a>
            </p>&mdash; 😷 Ivan 🌲🏎️💨🌲 (@Nothke) <a
                href="https://twitter.com/Nothke/status/1484912864578129924?ref_src=twsrc%5Etfw">January 22, 2022</a>
        </blockquote>`)

    setTimeout(function () {
        $("body").append(`
            <blockquote class="twitter-tweet tw-align-center" data-theme="dark">
    <p lang="en" dir="ltr">Lol, I was trying to add some nicer lighting in my room, but the plug rolled under the
        bed. <a href="https://twitter.com/hashtag/Podvarak?src=hash&amp;ref_src=twsrc%5Etfw">#Podvarak</a>&#39;s
        real life problems. <a href="https://t.co/x6nxdrLgqe">pic.twitter.com/x6nxdrLgqe</a></p>&mdash; 😷 Ivan
    🌲🏎️💨🌲 (@Nothke) <a href="https://twitter.com/Nothke/status/1476380544485277701?ref_src=twsrc%5Etfw">December
        30, 2021</a>
</blockquote>
    <script src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    `)
    }, 5000);
});
