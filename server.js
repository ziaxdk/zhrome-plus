﻿var express = require('express'),
    http = require('follow-redirects').http
    ;


var app = express();
var theServer = http.createServer(app);
app.use(express.bodyParser());
app.post("/proxy", function (appReq, appRes) {


    http.get(appReq.body.uri,function (httpRes) {
        var bufs = [];
        httpRes.on('data', function (data) {
            bufs.push(data);
        });
        httpRes.on('end', function (data) {
            var total = Buffer.concat(bufs);
            var html = total.toString();

            parse(html);
        });

    }).on('error', function (e) {
            console.log("Got error: " + e.message);
            appRes.send(")]}',\n");
    });



    var parse = function(html){
        console.log('start parsing');
        var title = getElement('title', html);
        var keywords = getMetaKeywords(html);

        var obj = {
            title: title,
            keywords: keywords
        };
        appRes.send(")]}',\n" + JSON.stringify(obj));
    };


    var getMetaKeywords = function(html, start) {
      var start = getStartElement('meta', html, start);
      var end = getEndElement(start, html);
      
      //console.log('start', start, 'end', end);
      //console.log(val);
      if (start === -1 || end === -1) return;

      var val = html.substring(start+7, end);
      if (val.toLowerCase().indexOf('keywords') === -1) {
        return getMetaKeywords(html, end);
      }
      else {
        return getAttributeValue('content', val);
      }


    };


    var getStartElement = function(tag, html, start) {
      return html.toLowerCase().indexOf('<'+tag, start || 0);
    };

    var getEndElement = function(start, html) {
      return html.toLowerCase().indexOf('/>', start);
    };

    var getElement = function(tag, html) {
      var start = html.toLowerCase().indexOf('<'+tag+'>');
      var end = html.toLowerCase().indexOf('</'+tag+'>');
      //console.log('start', start, 'end', end);
      if (start === -1 || end === -1) return;
      return html.substring(start+2+tag.length, end);
    };

    var getAttributeValue = function(name, html) {
        var start = html.toLowerCase().indexOf(name);
        if (start === -1) return;
        start = html.toLowerCase().indexOf('"', start);
        var end = html.toLowerCase().indexOf('"', start+1);
        return html.substring(start+1, end);
    };


});

app.use(express.static(__dirname + "/src"));
var port = process.env.PORT || 8080;
theServer.listen(port, function () {
    console.log("Listening on " + port);
});