var express = require('express'),
    http = require('http'),
    Parser = require("htmlparser2").WritableStream,
    Cornet = require("cornet"),
    $ = require("cheerio");

var cornet = new Cornet();
cornet.remove("script"); //remove all scripts

var app = express();
var theServer = http.createServer(app);
app.use(express.bodyParser());

app.post("/proxy", function(req, res){
    var options = {
      hostname: req.body.uri,
      port: 80,
      method: 'GET'
    };

    var req = http.request(options).on('response', function(response){
        console.log('response');
        response.pipe(new Parser(cornet));
    });
    req.end();

    cornet.select("head", function(elem){
        var title = $(elem).find("title").text();
        var keywords = $(elem).find("meta[name='keywords']").attr('content');

        var result = {
            title: title,
            keywords: keywords
        };
        console.log(result);
        res.send(")]}',\n" + JSON.stringify(result));
    });

});

app.use(express.static(__dirname + "/src"));
var port = process.env.PORT || 8080;
theServer.listen(port, function () {
    console.log("Listening on " + port);
});