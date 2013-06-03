var express = require('express'),
    http = require('http'),
    cheerio = require('cheerio')
    ;


var app = express();
var theServer = http.createServer(app);
app.use(express.bodyParser());
app.post("/proxy", function (req, res) {
    var search = {};
    var parseHtml = function (data) {
        var dom = cheerio.load(data);
        var title = dom('title').first().text();
        var keywords = dom('meta[name="keywords"]').first().attr('content');
        if (title)
            search.title = title.trim();
        if (keywords)
            search.keywords = keywords.trim();
    };


    http.get(req.body.uri,function (httpRes) {
        var bufs = [];
        httpRes.on('data', function (data) {
            bufs.push(data);
        });
        httpRes.on('end', function (data) {
            var total = Buffer.concat(bufs);
            var html = total.toString();
            console.log(html);

            parseHtml(html);

            console.log(search);

            res.setHeader("Content-Type", "application/json");
            res.send(")]}',\n" + JSON.stringify(search));
        });

    }).on('error', function (e) {
            console.log("Got error: " + e.message);
        });

});

app.use(express.static(__dirname + "/src"));
var port = process.env.PORT || 8080;
theServer.listen(port, function () {
    console.log("Listening on " + port);
});