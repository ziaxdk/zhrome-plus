var Parser = require("htmlparser2").WritableStream,
    Cornet = require("cornet"),
    minreq = require("minreq"),
    $ = require("cheerio");

var cornet = new Cornet();

minreq.get("http://www.airliners.net").pipe(new Parser(cornet));

cornet.remove("script");
cornet.remove("body");

//cornet.select("title", function(elem){title(elem);});
//cornet.select("TITLE", function(elem){title(elem);});

cornet.select("head", function(elem){meta(elem);});
cornet.select("HEAD", function(elem){meta(elem);});

/*var title = function(elem) {
  console.log("Page title:", $(elem).text().trim());
};*/

var meta = function(elem) {
    var title = $(elem).find("title").text() || $(elem).find("TITLE").text();
    //var keywords = $(elem).find("meta[name='Keywords']").attr('content');
    var keywords = "";

    var temp = $(elem).find("metA");
    console.log(temp, $);

    var result = {
        title: title,
        keywords: keywords
    };
    console.log(result);
};



