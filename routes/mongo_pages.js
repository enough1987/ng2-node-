


var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var con = mongoose.createConnection('localhost:27017/pages');
var pages_schema = new Schema({
  name : String,
  group : String,
  body : Array
 });
var pages_model = con.model('pages', pages_schema);


module.exports.ObjectId = ObjectId;
module.exports.pages_model = pages_model;