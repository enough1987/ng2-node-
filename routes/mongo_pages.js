

var mongoose = require(__dirname + '/mongoose_barrel.js').mongoose;
var Schema = require(__dirname + '/mongoose_barrel.js').Schema;


var con = mongoose.createConnection('localhost:27017/pages');
var pages_schema = new Schema({
  name : String,
  group : String,
  body : Array
 });
var pages_model = con.model('pages', pages_schema);


module.exports.pages_model = pages_model;