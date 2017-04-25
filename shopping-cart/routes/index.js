var express = require('express');
var router = express.Router();
var Product = require('../model/products');
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
        //console.log(docs.length);
        //console.log(req);
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