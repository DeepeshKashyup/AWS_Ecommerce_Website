
var express = require('express');
var router = express.Router();
var Product = require('../model/products');
/* GET home page. */

router.get('/', function(req, res, next) {
    Product.paginate({}, { page: 1, limit: 9 },function(err,result){
        var docs = result.docs;
        var productChunks = [];
        var chunkSize =3;
        console.log(docs.length);
        for(var i=0;i<docs.length;i+=chunkSize){
            productChunks.push(docs.slice(i,i+chunkSize));
            console.log(productChunks);
        }
        res.render('shop/index', { title: 'Shopping Cart', products:productChunks });
    });
});

router.get('/2', function(req, res, next) {
    Product.paginate({}, { page: 2, limit: 9 },function(err,result){
        var docs = result.docs;
        var productChunks = [];
        var chunkSize =3;
        console.log(docs.length);
        for(var i=0;i<docs.length;i+=chunkSize){
            productChunks.push(docs.slice(i,i+chunkSize));
            console.log(productChunks);
        }
        res.render('shop/index', { title: 'Shopping Cart', products:productChunks });
    });
});

router.get('/CellPhones&Accessories', function(req, res, next) {
    Product.paginate({categories: /^Cell/}, { page: 3, limit: 9 },function(err,result){
        var docs = result.docs;
        var productChunks = [];
        var chunkSize =3;
        //console.log(docs.length);
        for(var i=0;i<docs.length;i+=chunkSize){
            productChunks.push(docs.slice(i,i+chunkSize));
            //console.log(productChunks);
        }
        res.render('shop/index', { title: 'Shopping Cart', products:productChunks });
    });
});


router.get('/Tv&Video', function(req, res, next) {
    Product.paginate({categories: /^Tv/}, { page: 3, limit: 9 },function(err,result){
        var docs = result.docs;
        var productChunks = [];
        var chunkSize =3;
        //console.log(docs.length);
        for(var i=0;i<docs.length;i+=chunkSize){
            productChunks.push(docs.slice(i,i+chunkSize));
            //console.log(productChunks);
        }
        res.render('shop/index', { title: 'Shopping Cart', products:productChunks });
    });
});



router.get('/Games', function(req, res, next) {
    Product.paginate({categories: /^Video Games/}, { page: 3, limit: 9 },function(err,result){
        var docs = result.docs;
        var productChunks = [];
        var chunkSize =3;
        //console.log(docs.length);
        for(var i=0;i<docs.length;i+=chunkSize){
            productChunks.push(docs.slice(i,i+chunkSize));
            //console.log(productChunks);
        }
        res.render('shop/index', { title: 'Shopping Cart', products:productChunks });
    });
});

module.exports = router;
