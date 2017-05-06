var redis = require('redis');

var client = redis.createClient();

client.auth('password', function (err) {
    if (err) throw err;
});


client.on('connect', function() {
    console.log('Connected to Redis');
});
/*
client.get("Cell Phones & Accessories",function(err,db1){
    d1 = JSON.parse(db1.replace(/'/g, '"'));
    //console.log(d1);
    //client.quit();
    return d1;
    client.quit();
});

console.log(db1);*/


client.get("Cell Phones & Accessories",function(err,db1){
    d1 = JSON.parse(db1.replace(/'/g, '"'));
    //console.log(d1);
    client.get("Tv & Video",function(err,db2){
        d2 = JSON.parse(db2.replace(/'/g, '"'));

        client.get("Tv & Video",function(err,db3){
            d3 = JSON.parse(db2.replace(/'/g, '"'));
            client.get("Video Games",function(err,db3){
                d4 = JSON.parse(db2.replace(/'/g, '"'));
                client.get("Men's Grooming",function(err,db3){
                    d5 = JSON.parse(db2.replace(/'/g, '"'));

                    console.log("Printing d5")
                    console.log(d5);
                    console.log("Printing d4")
                    console.log(d4);
                    console.log("Printing d3")
                    console.log(d3);
                    console.log("Printing d2")
                     console.log(d2);
                     console.log("Printing d1")
                     console.log(d1);
                });
            });
        });
    });
    client.quit();
});


   // console.log(obj);



