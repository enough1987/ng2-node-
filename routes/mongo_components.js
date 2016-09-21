

var mongoose = require(__dirname + '/mongoose_barrel.js').mongoose;
var Schema = require(__dirname + '/mongoose_barrel.js').Schema;


var con = mongoose.createConnection('localhost:27017/components');
var components_schema = new Schema({
  name : String,
  group : String,
  body : Array
 });
var components_model = con.model('components', components_schema);


module.exports.components_model = components_model;