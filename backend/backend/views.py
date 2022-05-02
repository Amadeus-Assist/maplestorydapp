import json
from django.http import JsonResponse
from rest_framework import status
from django.shortcuts import render, redirect
from . import mongodb
import pymongo


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
        if not mongo_client['user_info']['info_collection'].find(query):
            response_data = {
                'message': 'invalid login info.'
            }
            return JsonResponse(response_data, safe=False, status=400)  # status???
        else:
            token = mongo_client['user_info']['info_collection'].find(query, {'token': 1})
            character_info = mongo_client['user_info']['info_collection'].find(query, {'character_info': 1})
            response_data = {
                'message': 'ok',
                'token': token,
                'character_info': character_info
            }
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
        query = {'username': username, 'password': password}

        if mongo_client['user_info']['info_collection'].find(query):
            response_data = {
                'message': 'Duplicate register info.'
            }
            return JsonResponse(response_data, safe=False, status=400)
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

        username = body['username']
        token = body['token']
        character_info = body['character_info']
        query = {'token': token}

        if not mongo_client['user_info']['info_collection'].find(query):
            response_data = {
                'message': 'Invalid token'
            }
            return JsonResponse(response_data, safe=False, status=400)
        else:
            myquery = {"token": token}
            new_values = {"$set": {"character_info": character_info}}
            mongo_client['user_info']['info_collection'].update(myquery, new_values)
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

    if request.method == 'GET':
        mongo_client = mongodb.get_client()
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        username = body['username']
        token = body['token']
        query = {'token': token}

        equipment = mongo_client['user_info']['info_collection'].find(query, {'equipment': 1})
        response_data = list(equipment)

        return JsonResponse(response_data, safe=False, status=200)

