


var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


mongoose.connect('localhost:27017/pages');
var pages_schema = new Schema({
  name : String,
  collection : String,
  body : Array
 });
var pages_model = mongoose.model('pages', pages_schema);


module.exports.ObjectId = ObjectId;
module.exports.pages_model = pages_model;