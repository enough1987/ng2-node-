

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

mongoose.connect('localhost:27017/pages');


var schema = new Schema({
  name : String,
  group : String,
  mutability : String,
  body : Array
 });
var model = mongoose.model('pages', schema);



module.exports.ObjectId = ObjectId;
module.exports.model = model;
