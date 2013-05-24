var express = require('express'), 
    http = require('http')
    ;


//var parsers = [/<title>(.*?)</title>/i'];
var parsers = [/<title>(.*?)<\/title>/i];

var app = express();
var theServer = http.createServer(app);
app.use(express.bodyParser());
app.post("/proxy", function(req, res){
    var parseHtml = function(data){
        var res = [];
        

        var p = parsers[0];
        var m = p.exec(data);
        if (m) res.push(m[1]);

        return res;
    };


    http.get(req.body.uri, function(httpRes) {
        var bufs = [];
        httpRes.on('data', function(data) { 
            bufs.push(data);
        });
        httpRes.on('end', function(data) { 
            var total = Buffer.concat(bufs);
            var html = total.toString();

            var search = {
                keywords: parseHtml(html)
            };

            console.log(search);

            res.setHeader("Content-Type", "application/json");
            res.send(")]}',\n" + JSON.stringify(search)); 
        });

    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });

});

app.use(express.static(__dirname + "/src"));
var port = process.env.PORT || 8080;
theServer.listen(port, function () {
    console.log("Listening on " + port);
});