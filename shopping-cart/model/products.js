/**
 * Created by deepe on 4/18/2017.
 */
var mongoose = require('mongoose');
//pagination
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var schema = new Schema({
    ASIN : {type : String,required:true},
    imgPath : {type : String,required:true},
    description:{type : String,required:true},
    title : {type : String,required:true},
    price :{type : String,required:true}
});

//pagination
schema.plugin(mongoosePaginate)
//schema.plugin(mongoosastic)
module.exports = mongoose.model("Product",schema);
