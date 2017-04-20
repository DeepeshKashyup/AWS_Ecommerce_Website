from lxml import html
import requests
import Amazonconnector as amazon
import json
import pandas
import pymongo

connection = pymongo.MongoClient("mongodb://localhost:27017/");

db = connection.Shopping
p = db.products

def getProductBySearchKey(search):
    search = search
    productDict = amazon.getProductURLArray(search)
    valid = 200
    reviewData = {}
    count = 0
    for productAsin in productDict:
        #fetch iframeURL and fetch all review page url
        count += 1

        print("PRODUCT[ASIN]: " + productAsin)
        reviewData[productAsin] = []


        status_code = -1
        page = requests.get(productDict[productAsin])
        while(status_code != valid):                            #ensures page returns valid response
            page = requests.get(productDict[productAsin])         #fetches page from url
            status_code = page.status_code                      #fetches status_code for internal comparison

        tree = html.fromstring(page.content)

        productdescription = tree.xpath(".//div[@id='productDescription']//p/text()")
        productprice = tree.xpath(".//span[@id='priceblock_ourprice']/text()")
        imgPath = tree.xpath(".//div[@id='imgTagWrapperId']//img/@src")[0]
        title = tree.xpath(".//div[@id='titleSection']//span[@id='productTitle']/text()")[0]      
        
        if(len(productdescription) > 0):
            productdescription = productdescription[0].strip()
        else:
            productdescription = ""

        if(len(productprice) > 0):
            productprice = productprice[0].strip()
        else:
            productprice = ""
        productDeatilsTable = tree.xpath(".//table[@id='productDetails_detailBullets_sections1']")
        if(len(productDeatilsTable) > 0):
            productAttributeRows = productDeatilsTable[0].xpath(".//tr")
            reviewData[productAsin].append({'ProductDescription':productdescription})
            rowdetails ={}
            rowdetails['description']  =productdescription
            rowdetails['price'] = productprice
            rowdetails['imgPath'] = imgPath
            rowdetails['title'] = title
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
            print rowdetails
            p_id = p.insert(rowdetails)
            reviewData[productAsin].append(rowdetails)
            #print(reviewData[productAsin])
#            d = pandas.DataFrame.from_dict(reviewData, orient='columns')
#            print(d[productAsin])

    return reviewData
#    return d


data = getProductBySearchKey("iphone")

print(len(data))
