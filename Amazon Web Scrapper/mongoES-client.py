import json
import pandas
import pymongo
from elasticsearch import Elasticsearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth
import re

# mongo connection
connection = pymongo.MongoClient("mongodb://localhost:27017/");
db = connection.Shopping
p = db.products
count = p.count()


es = Elasticsearch(
    hosts=[{'host': host, 'port': 443}],
    http_auth=awsauth,
    use_ssl=True,
    verify_certs=True,
    connection_class=RequestsHttpConnection
)

print(es.info())
l = []
cnt = 1
prod = {}



for i in range(1,count):
        res = es.get(index="shopping", doc_type='products', id=i,ignore=[404])
        print res
        if res['found'] == False:
                doc = p.find_one({'_id':i});
                keys = doc.keys()
                for k in keys:
                        if "_id" in k:
                                print "hey"
                                continue;
                        val = doc.get(k)
                        prod[k] = val
                print prod
                try:
                        res = es.index(index='shopping', doc_type='products', id=i,body = prod)
                        print res['created']
                except:
                        print "Oops! Encoding Error"
