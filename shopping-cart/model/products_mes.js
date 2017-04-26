/**
 * Created by deepe on 4/18/2017.
 * Did not work
 */

var mongoose = require('mongoose');
var elasticsearch = require('elasticsearch')
var esClient = new elasticsearch.Client({host: 'localhost:9200'});
var mongoosastic = require('mongoosastic');

//pagination
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var schema = new Schema({
    imgPath : {type : String,required:true},
    description:{type : String,required:true},
    title : {type : String,required:true},
    price :{type : String,required:true}
});

//pagination
schema.plugin(mongoosePaginate)
schema.plugin(mongoosastic, {
    esClient: esClient
})

module.exports = mongoose.model("Product",schema);
