import pymongo

from pymongo import MongoClient



def get_client():
    client = pymongo.MongoClient("mongodb+srv://Piquenbauer:dbuserdbuser@cluster0.plgoy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    db = client.test
    return client



