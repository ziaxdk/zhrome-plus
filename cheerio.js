var cheerio = require('cheerio'),
  http = require("http"),
  fs = require("fs");


var fetch = function (uri) {
  console.log("fetching ", uri);
  var html;


  http.get(uri, function (httpRes) {
    httpRes.on('data', function (data) {
      html += data;
    });
    httpRes.on('end', function (data) {
      var search = {};
      if (!html) {
        console.log("No html");
        return search;
      }
      var final = html.toString();
      var parsers = [
        {
          pattern: /<title>([\w\W]*?)<\/title>/gim,
          text: 'title'
        },
        {
          pattern: /<meta name="keywords" content="([\w\W]*?)" \/>/gim,
          text: 'Keywords',
          action: function (keywords) {
            return keywords.split(/,\s?/);
          }
        }
      ];

      //<meta name="keywords" content="politiken,nyheder,sport,indland,danmark,udland,internationalt,erhverv,politik,debat,blogs,wulffmorgenthaler,tjek,forbrug,ibyen,biler " />



      parsers.forEach(function (obj) {
        var match = obj.pattern.exec(final);
        if (match) {
          search[obj.text] = obj.action ? obj.action(match[1]) : match[1];
        }
      });

      console.log(search);

    });
    httpRes.on('error', function (e) {
      console.log("Got error: " + e.message);
    });
  });
};

//fetch("http://www.airliners.net");
//fetch("http://www.bt.dk");
//fetch("http://www.ziax.dk");
fetch(process.argv[2]);


