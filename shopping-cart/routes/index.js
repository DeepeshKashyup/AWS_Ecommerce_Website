/**
 * Created by deepe on 5/3/2017.
 */
var express = require('express');
var router = express.Router();
var Product = require('../model/products');
var config = require('../config')
/* Elastic Search changes*/
var elasticsearch = require('elasticsearch');
// redis
var redis = require('redis');

var redisclient = redis.createClient(config.redis.PORT, config.redis.HOST);

//var redisclient = redis.createClient();
redisclient.auth('password', function (err) {
    if (err) throw err;
});

redisclient.on('connect', function() {
    console.log('Connected to Redis');
});

// redis
var client;
if (config.elasticsearch.HOST == "localhost") {
    client = new elasticsearch.Client({});
}
else {
    client = new elasticsearch.Client({
        accessKeyId: config.elasticsearch.ACCESSKEYID,
        secretAccessKey: config.elasticsearch.SECRETACCESSKEY,
        service: config.elasticsearch.SERVICE,
        region: config.elasticsearch.REGION,
        host: config.elasticsearch.HOST
    });
}

//csrf protection

var csrf = require('csurf');
var csrfprotection = csrf();
router.use(csrfprotection);

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


/* Sign up Page */

router.get('/user/signup',function(req,res,next){
    res.render('user/signup',{csrfToken:req.csrfToken()})
});

router.post('/user/signup',function(req,res,next){
    res.redirect("/");
});

/* GET home page. */
router.get('/', function(req, res, next) {

    redisclient.get("Cell Phones & Accessories",function(err,result){
        var c1 = [];
        var c2 = [];
        var chunkSize =4;
        var obj1 = JSON.parse(result.replace(/'/g, '"'));

        for(var i=0;i<obj1.length;i+=chunkSize){
            if(i==0)
                c1.push(obj1.slice(i,i+chunkSize));
            else
                c2.push(obj1.slice(i,i+chunkSize));
            //console.log(productChunks);
        }
        redisclient.get("Tv & Video",function(err,result){
            var t1 = [];
            var t2 = [];
            var chunkSize =4;
            var obj2 = JSON.parse(result.replace(/'/g, '"'));

            for(var i=0;i<obj2.length;i+=chunkSize){
                if(i==0)
                    t1.push(obj2.slice(i,i+chunkSize));
                else
                    t2.push(obj2.slice(i,i+chunkSize));
                //console.log(productChunks);
            }
            redisclient.get("Video Games",function(err,result){
                var m1 = [];
                var m2 = [];
                var chunkSize =4;
                var obj3 = JSON.parse(result.replace(/'/g, '"'));

                for(var i=0;i<obj3.length;i+=chunkSize){
                    if(i==0)
                        m1.push(obj3.slice(i,i+chunkSize));
                    else
                        m2.push(obj3.slice(i,i+chunkSize));
                    //console.log(productChunks);
                }
                res.render('shop/indexMain', { title: 'Best Stores'
                    , c1: c1, c2: c2, t1: t1, t2: t2, m1: m1, m2: m2, csrfToken: req.csrfToken()});

                //redisclient.quit();
            });
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
    var searchParams = {
        index: 'shopping',
        from: (pageNum - 1) * perPage,
        size: perPage,
        type: 'products',
        body: {
            query: {
                multi_match: {
                    fields:  [ "description", "title" ],
                    query:     userQuery,
                    fuzziness: "AUTO"
                }
            }
        }
    };


    client.search(searchParams, function (err, res) {
        if (err) {
            // handle error
            throw err;
        }
        //console.log(res);
        var results = res.hits.hits.map(function(i){
            return i['_source'];
        });
        var productChunks = [];
        var chunkSize = 3;
        for(var i = 0;i<results.length;i+=chunkSize){
            productChunks.push(results.slice(i,i+chunkSize));

            console.log(productChunks);
        }
        response.render('shop/index', {title: 'Best Stores',
            products: productChunks
        });
    });
});

router.get('/loadProduct', function (req, res) {
    console.log("Calling MongoDB to load product Details!");
    var productId = req.query.ASIN;
    console.log(productId)

    Product.find({ASIN: productId}, function(err, products) {
        console.log("Connect to MongoDB");
        /*if( err || !products) console.log("No product found");
         else products.forEach( function(product) {
         console.log(product);
         //	pName = 	product.name;
         // console.log("pName"+pName);
         productJson = JSON.parse(product);
         });*/

        console.log("productName from MongoDb"+products);

        res.render('shop/product',{title: 'Best Stores',products : products});
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
        //console.log(docs);
        //console.log(typeof(result.docs));
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
        res.render('shop/index', { title: 'Best Stores'
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
