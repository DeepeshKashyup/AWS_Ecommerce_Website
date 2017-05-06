import re
import pymongo
import redis
import unicodedata
import json,ast

# mongo connection
connection = pymongo.MongoClient("mongodb://ec2-35-167-37-100.us-west-2.compute.amazonaws.com:27017/");
db = connection.shopping
p = db.products
count = p.count()


r = redis.StrictRedis(host='localhost', port=6379, db=0)


print p.find_one({'categories':"Cell Phones & Accessories",'_id':1});
x = {}
prod = {}

def mongoSearch(search,startpoint):
    l_search = []
    cnt = 8
    for i in range(startpoint,startpoint+cnt):
        prd = p.find_one({'categories':search,'_id':i});
        for k in prd.keys():
            if k == "title" or k == "imgPath" or k == "ASIN" :
                prod[k] = prd[k]
        
        doc = ast.literal_eval(json.dumps(prod))
        #print doc
        l_search.append(doc)
    print l_search
    
    r.set(search,l_search)
                
mongoSearch("Cell Phones & Accessories",1)
mongoSearch("Tv & Video",50)
mongoSearch("Video Games",82)
mongoSearch("Men's Grooming",171)
mongoSearch("Men's Clothing",196)
mongoSearch("Women's Clothing",227)
mongoSearch("Exercise & Fitness",276)
