from lxml import html
import requests
import Amazonconnector as amazon
import json
import pandas
import pymongo

connection = pymongo.MongoClient("mongodb://ec2-35-167-37-100.us-west-2.compute.amazonaws.com:27017/");

db = connection.Shopping
p = db.products
count = p.count()
##doc = p.find_one({'ASIN':'B00NQGP42Y'});
##print doc

def fieldValidation(field):
    if(len(field) > 0):
            value = field[0].strip()
    else:
            value = ""
    return value

def getProductBySearchKey(search):
    global count
    #count = count + 1
    #print count
    search = search
    productDict = amazon.getProductURLArray(search)
    valid = 200
    reviewData = {}
    #count = 0
    #reviewData['categories'] = search
    for productAsin in productDict:
        
        print "Doc Count :",count+1
        #fetch iframeURL and fetch all review page url
        #count += 1
        print("PRODUCT[ASIN]: " + productAsin)
        #print type(productAsin)
        doc = p.find_one({'ASIN':str(productAsin)});
        #print doc
        if doc is not None:
            continue;

        reviewData[productAsin] = []

        
        status_code = -1
        page = requests.get(productDict[productAsin])
        while(status_code != valid):                            #ensures page returns valid response
            page = requests.get(productDict[productAsin])         #fetches page from url
            status_code = page.status_code                      #fetches status_code for internal comparison

        tree = html.fromstring(page.content)

        productdescription = tree.xpath(".//div[@id='productDescription']//p/text()")
        productprice = tree.xpath(".//span[@id='priceblock_ourprice']/text()")
        imgPath = tree.xpath(".//div[@id='imgTagWrapperId']//img/@src")
        title = tree.xpath(".//div[@id='titleSection']//span[@id='productTitle']/text()")
        
        #print 'imgpath ',imgPath
        productdescription = fieldValidation(productdescription);
        productprice = fieldValidation(productprice);
        title = fieldValidation(title);
        if len(title) == 0:
            continue;
        print "title ",title
        imgPath = fieldValidation(imgPath);
        rowdetails ={}
        rowdetails['categories'] = search
        rowdetails['description']  =productdescription
        rowdetails['price'] = productprice
        rowdetails['imgPath'] = imgPath
        rowdetails['title'] = title
        rowdetails['ASIN'] = str(productAsin)
        productDeatilsTable = tree.xpath(".//table[@id='productDetails_detailBullets_sections1']")
        if(len(productDeatilsTable) > 0):
            productAttributeRows = productDeatilsTable[0].xpath(".//tr")
            reviewData[productAsin].append({'ProductDescription':productdescription})
            #rowdetails ={}
            
            for row in productAttributeRows:
                #rowdetails = {}
                th = row.xpath(".//th/text()")[0].strip()
                if th == "Customer Reviews" or th== "Best Sellers Rank":
                    td = row.xpath(".//td/text()")[-1].strip()
                elif th == "Date first available at Amazon.com":
                    th = "Availablity"
                    td = row.xpath(".//td/text()")[-1].strip()
                else:
                    td = row.xpath(".//td/text()")[0].strip()
                rowdetails[th.replace(' ','')] = td
        #print rowdetails
        count += 1
        rowdetails['_id'] = count
        p_id = p.insert(rowdetails,count)
        print p_id
        #reviewData[productAsin].append(rowdetails)
            #print(reviewData[productAsin])
#            d = pandas.DataFrame.from_dict(reviewData, orient='columns')
#            print(d[productAsin])

    return reviewData
#    return d

getProductBySearchKey("Cell Phones & Accessories")
getProductBySearchKey("Tv & Video")
getProductBySearchKey("Video Games")
getProductBySearchKey("Men's Grooming")
getProductBySearchKey("Men's Clothing")
getProductBySearchKey("Women's Clothing")
getProductBySearchKey("Exercise & Fitness")

