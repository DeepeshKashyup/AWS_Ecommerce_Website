var config = {}

config.redis = {}
config.mongo = {}
config.elasticsearch = {}

config.redis.HOST = "localhost"
config.redis.PORT = 6379

config.elasticsearch.ACCESSKEYID = ""
config.elasticsearch.SECRETACCESSKEY = ""
config.elasticsearch.SERVICE = ""
config.elasticsearch.REGION = ""
config.elasticsearch.HOST = "localhost"

config.mongo.HOST = "localhost:27017/shopping"

module.exports = config