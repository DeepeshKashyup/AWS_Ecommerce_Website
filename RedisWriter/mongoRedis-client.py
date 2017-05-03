
import pymongo
import redis


# mongo connection
connection = pymongo.MongoClient("mongodb://localhost:27017/");
db = connection.Shopping
p = db.products
count = p.count()


r = redis.StrictRedis(host='localhost', port=6379, db=0)



l = []
cnt = 1
prod = {}

def mongoSearch(search):
    for i in range(1,6):
        doc = p.find_one({'categories':search});
        keys = doc.keys()
        for k in keys:
            val = doc.get(k)
            prod[k] = val
        #print prod
        r.hset(search,i,prod)
                
                

##doc = p.find_one({'_id':2});
##keys = doc.keys()
##for k in keys:
##    val = doc.get(k)
##    prod[k] = val
###print prod
##
##r.hset("Cell Phones & Accessories",2,prod)

mongoSearch("Cell Phones & Accessories")
mongoSearch("Tv & Video")

print r.hgetall("Cell Phones & Accessories")
print r.hgetall("Tv & Video")
