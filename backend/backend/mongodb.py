import certifi
import pymongo

from pymongo import MongoClient



def get_client():
    client = \
        pymongo.MongoClient(
            "mongodb+srv://Piquenbauer:dbuserdbuser@cluster0.plgoy.mongodb.net/sample_analytics?retryWrites=true&w=majority",
            tlsCAFile=certifi.where()
        )
    db = client.test
    return client


c = get_client()
c_db = c['sample_analytics']
c_col = c_db['accounts']
x = c_col.find({'account_id': 198100}, {'account_id': 1})
for i in x:
    print(i)


