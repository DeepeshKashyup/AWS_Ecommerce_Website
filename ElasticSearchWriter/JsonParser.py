import elasticsearch
import re

f = open("c:\users\deepe\desktop\data.json")
d = f.read()
es = elasticsearch.Elasticsearch()  # use default of localhost, port 9200
# re.search('{.*}', f).group()
l = []
cnt = 1
while True:
    start_pos = d.find("{")
    end_pos = d.find("}")
    print start_pos, end_pos
    doc = d[start_pos:end_pos+1]
    postid_start = d.find(")") + 2
    doc = "{"+d[postid_start:end_pos+1]
    d = d[end_pos+1:]
    #print doc
    if start_pos == -1:
        break;
    res = es.index(index='shopping', doc_type='products', id=cnt,body = doc)
    print res['created']
    if cnt == 1000:
        break;
    cnt = cnt + 1
    #print start_pos, end_pos
#print es.get(index='shopping', doc_type='products', id=1)
#print es.get(index='shopping', doc_type='products', id=2)
#print es.get(index='shopping', doc_type='products', id=3)
print l




