/**
 * Created by deepe on 4/26/2017.
 */

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
    q: 'pants'
}).then(function (body) {
    console.log(resp)
    //var hits = body.hits.hits;
}, function (error) {
    console.trace(error.message);
});*/

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
    //var hits = resp.hits.hits;
    var results = resp['hits']['hits'].map(function(i){
        return i['_source'];
    });
    console.log(results);
}, function (err) {
    console.trace(err.message);
});