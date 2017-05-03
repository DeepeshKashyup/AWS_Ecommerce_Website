/**
 * Created by deepe on 4/18/2017.
 */

var Product = require('../model/products')
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/Shopping');

var product = [new Product({
    imagePath : 'https://images-na.ssl-images-amazon.com/images/I/51jBNPgWISL._SY300_QL70_.jpg',
    title :'Apple iPhone 6 16GB Factory Unlocked GSM 4G LTE Smartphone, Gold (Certified Refurbished)',
    description:'W',
    price:'$282.05'
})];

var done = 0;
for(var i = 0; i<product.length;i++){
    product[i].save(function(err,result){
       done++;
       if(done==product.length){
           exit();
       }
    });
}

function exit(){
    mongoose.disconnect();
}