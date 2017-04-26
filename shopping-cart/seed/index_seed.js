
/* Did not work */
var mongoose = require('mongoose')
mongoose.connect('localhost:27017/Shopping');

var Product = require('../model/products_mes');


var stream = Product.synchronize(), count = 0;

stream.on('data', function(err, doc){
  count++;
});
stream.on('close', function(){
  console.log('indexed ' + count + ' documents!');
});
stream.on('error', function(err){
  console.log(err);
});