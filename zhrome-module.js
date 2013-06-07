var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;


var linkSchema = new Schema({
  url: String,
  title: String,
  keywords: String,
  clicks: Number,
  created: { type: Date, default: Date.now }
});
var Link = mongoose.model('Link', linkSchema);


function ZhromePlus() {
  /*var blogSchema = new Schema({
    title:  String,
    author: String,
    body:   String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
      votes: Number,
      favs:  Number
    }
  });*/
};
module.exports = new ZhromePlus();

ZhromePlus.prototype.foo = function() {
  return "bar";
};
ZhromePlus.prototype.save = function(data) {
  var conn = mongoose.connect("mongodb://USER:PASS@ds027688.mongolab.com:27688/ziaxdeveloperplugin");
/*
  var conn = mongoose.createConnection('your connection string');
var MyModel = mongoose.model('ModelName', schema);
var m = new MyModel;
m.save() // does not work b/c the default connection object was never connected
*/
};