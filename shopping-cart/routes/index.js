var express = require('express');
var router = express.Router();
var Product = require('../model/products');
/* Elastic Search changes*/
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
}, function (error) {
    if (error) {
        console.trace('elasticsearch cluster is down!');
    } else {
        console.log('All is well');
    }
});

/*
 client.search({
 index: 'shopping',
 type: 'products',
 body: {
 query: {
 match: {
 title: "Apple"
 }
 }
 }
 }).then(function (resp) {
 // console.log(resp)
 var hits = resp.hits.hits;
 console.log(hits)
 }, function (err) {
 console.trace(err.message);
 });*/



/* GET home page. */
router.get('/', function(req, res, next) {
    Product.paginate({}, { page: 1, limit: 9 },function(err,result){
        var docs = result.docs;
        var productChunks = [];
        var chunkSize =3;
        //console.log(docs.length);
        //console.log(req);
        console.log(req.path);
        for(var i=0;i<docs.length;i+=chunkSize){
            productChunks.push(docs.slice(i,i+chunkSize));
            //console.log(productChunks);
        }
        res.render('shop/index', { title: 'Shopping Cart'
            , products:productChunks
            , helpers: { foo : function (){
                var ret="";

                for(var i=1, j=result.total%9; i<=j; i++) {
                    ret = ret +"<li class=\"page-item\"><a class=\"page-link\" href=\"/1\">"+i+"</a></li>";
                        //+ "<li>" + options.fn(context[i]) + "</li>"
                }

                return ret;
                }
            }
        });
    });
});

/* ES Changes */
//^search?q=:query
router.get('/search',function(request,response,next){
    var pageNum = 1;
    var perPage = 9;
    var userQuery = request.param('query');
    console.log(userQuery);
    //var userId = request.session.userId;
    console.log(request);
    var searchParams = {
        index: 'shopping',
        from: (pageNum - 1) * perPage,
        size: perPage,
        type: 'products',
        body: {
            query: {

                match: {
                            // match the query against all of
                            // the fields in the posts index
                            title: userQuery
                }


            }
        }
    };

    client.search(searchParams, function (err, res) {
        if (err) {
            // handle error
            throw err;
        }
        var results = res.hits.hits.map(function(i){
            return i['_source'];
        });
        /*var results = res['hits']['hits'].map(function(i){
            return i['_source'];
        });*/
        console.log(results);
        //var docs = res.hits.hits._source;
        //console.log(docs);
        var productChunks = [];
        var chunkSize = 3;
        for(var i = 0;i<results.length;i+=chunkSize){
         productChunks.push(results.slice(i,i+chunkSize));
         console.log(productChunks);
        }
        response.render('shop/index', {
            products: productChunks
            //page: pageNum,
            //pages: Math.ceil(res.hits.total / perPage)
        });
    });
});

router.get('^/[aA-zZ]+&?[aA-zZ]*/:page', function(req, res, next) {

    path = req.path.split("/")[1];
    searchQuery = path.split("&")[0];

    var queryParm = {categories:searchQuery}
    console.log("Search Query :"+new RegExp(searchQuery));
    console.log("Query Parm:"+queryParm);
    Product.paginate({categories:new RegExp(searchQuery)}, { page: req.param("page"), limit: 9 },function(err,result){
        var docs = result.docs;
        var productChunks = [];
        var chunkSize =3;
        console.log(docs);
        console.log(typeof(result.docs));
        path = req.path.split("/")[1];
        current_page = parseInt(req.path.split("/")[2]);
        if(current_page==1)
            prev_page = 1;
        else
            prev_page = current_page-1
        console.log(path);
        console.log(current_page);
        for(var i=0;i<docs.length;i+=chunkSize){
            productChunks.push(docs.slice(i,i+chunkSize));
            //console.log("docs:"+productChunks);
        }
        res.render('shop/index', { title: 'Shopping Cart'
            , products:productChunks
            , helpers: {
            path : path,
            prev_page : prev_page,
            next_page : current_page+1,
            pages : function (){
                var ret="";

                for(var i=1, j=result.total%9; i<=j; i++) {
                    ret = ret +"<li class=\"page-item\"><a class=\"page-link\" href=\"/"+path+"/"+i+"\">"+i+"</a></li>";
                    //+ "<li>" + options.fn(context[i]) + "</li>"
                }

                return ret;
            }
            }
        });
    });
});

module.exports = router;