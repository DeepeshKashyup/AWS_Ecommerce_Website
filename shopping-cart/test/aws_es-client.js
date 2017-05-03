/**
 * Created by deepe on 5/3/2017.
 */


var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    accessKeyId: 'XXXXXXXXXXXXXXXXXXXXXX',
    secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
    service: 'es',
    region: 'us-west-2',
    host: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
});

var searchParams = {
    index: 'shopping',
    type: 'products',
    body: {
        query: {

            multi_match: {
                // match the query against all of
                // the fields in the posts index
               // title: "menn"
                fields:  [ "description", "title" ],
                query:     "menn",
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
    var results = res.hits.hits.map(function (i) {
        return i['_source'];
    });
    console.log(results);

});

