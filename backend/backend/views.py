import json
from django.http import JsonResponse
from django.http import HttpResponseBadRequest
from django.shortcuts import render, redirect

from . import mongodb

import pymongo
import random

token_dict = {}


def login(request):
    """Handle user login"""

    if request.method == 'POST':

        body_unicode = request.body.decode('utf-8')
        # print(body_unicode)
        body = json.loads(body_unicode)
        username = body['username']
        password = body['password']

        mongo_client = mongodb.get_client()
        query = {'username': username, 'password': password}
        query_result = mongo_client['user_info']['info_collection'].find_one(query)
        print(query_result)
        if not query_result:
            return HttpResponseBadRequest("Invalid login info")
        else:
            print("here2")
            print('character_info' in query_result)
            if 'character_info' in query_result:
                character_info = query_result['character_info']
            else:
                character_info = ""
             # if ('character_info' in query_result) else ""
            # print("chara_info: "+query_result['character_info'])
            token = random.randint(1, 2000)  # 生成随机数
            token_dict[username] = token
            # character_info = mongo_client['user_info']['info_collection'].find_one(query, {'character_info': 1})
            response_data = {
                'message': 'ok',
                'token': token,  # 存储token到dict
                'character_info': character_info
            }
            print(response_data)
            return JsonResponse(response_data, safe=False, status=200)


def index(request):
    pass
    return render(request, 'login/index.html')


def register(request):
    """Handle user register"""

    if request.method == 'POST':
        mongo_client = mongodb.get_client()
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        username = body['username']
        password = body['password']
        bundle_address = body['bundle_address']
        query1 = {'username': username}
        query2 = {'bundle_address': bundle_address}
        print(body)

        if mongo_client['user_info']['info_collection'].find_one(query1) or mongo_client['user_info'][
            'info_collection'].find_one(query2):
            return HttpResponseBadRequest("Duplicate register info.")
        else:
            insert_data = {
                'username': username,
                'password': password,
                'bundle_address': bundle_address
            }
            mongo_client['user_info']['info_collection'].insert_one(insert_data)
            response_data = {
                'message': 'ok'
            }
            return JsonResponse(response_data, safe=False, status=200)


def logout(request):
    update(request)


def update(request):
    """Handle updating character info for particular user"""

    if request.method == 'POST':
        mongo_client = mongodb.get_client()
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        print(body)

        username = body['username']
        token = body['token']
        character_info = body['character_info']

        if username not in token_dict or token != token_dict[username]:
            return HttpResponseBadRequest('Invalid token')
        else:
            myquery = {"username": username}
            new_values = {"$set": {"character_info": character_info}}
            mongo_client['user_info']['info_collection'].update(myquery, new_values)  # 1 username <-> 1 char_info ??
            response_data = {
                'message': 'ok'
            }
            return JsonResponse(response_data, safe=False, status=200)


def pick_equipment(request):
    """Handle picking equipment and putting it into the Blockchain"""
    pass


def add_balance(request):
    """Handle adding balance to the Blockchain system"""
    pass


def query_equipment(request):
    """Handle querying current equipment of particular character"""
    pass
    # if request.method == 'POST':
    #     mongo_client = mongodb.get_client()
    #     body_unicode = request.body.decode('utf-8')
    #     body = json.loads(body_unicode)
    #
    #     username = body['username']
    #     token = body['token']
    #     query = {'token': token}
    #
    #     equipment = mongo_client['user_info']['info_collection'].find(query, {'equipment': 1})
    #     response_data = list(equipment)
    #
    #     return JsonResponse(response_data, safe=False, status=200)
