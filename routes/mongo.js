

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

mongoose.connect('localhost:27017/components');

var components_schema = new Schema({
  name : String,
  group : String,
  mutability : String,
  body : Array
 });
var components_model = mongoose.model('components', components_schema);



module.exports.ObjectId = ObjectId;
module.exports.components_model = components_model;
