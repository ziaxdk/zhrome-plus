var express = require('express'),
    http = require('http'),
    Parser = require("htmlparser2").WritableStream,
    Cornet = require("cornet"),
    minreq = require("minreq"),
    $ = require("cheerio");


var cornet = new Cornet();
cornet.remove("script"); //remove all scripts
//cornet.remove("body"); //remove all scripts

var app = express();
var theServer = http.createServer(app);
app.use(express.bodyParser());

app.post("/proxy", function(req, res){

    cornet.select("head", function(elem) {
        console.log('cornet select');
        var title = $(elem).find("title").text();
        var keywords = $(elem).find("meta[name='keywords']").attr('content');

        var result = {
            title: title,
            keywords: keywords
        };
        console.log(result);
        res.send(")]}',\n" + JSON.stringify(result));
    });

        minreq.get(req.body.uri).pipe(new Parser(cornet));    
        /*http.get({
        hostname: req.body.uri,
        port: 80,
        path: '/',
        agent:false,
        headers: {
        }
    }, function(res2) {
        console.log('StatusCode', res2.statusCode);
        if (res2.statusCode == 200) {
          res2.pipe(new Parser(cornet));
        }
        else
        {
          res.send(")]}',\n");
        }
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });*/


});

app.use(express.static(__dirname + "/src"));
var port = process.env.PORT || 8080;
theServer.listen(port, function () {
    console.log("Listening on " + port);
});