import json
from django.http import JsonResponse
from django.http import HttpResponseBadRequest
from django.shortcuts import render, redirect

from . import mongodb
from . import web3_lib

import pymongo
import random
import time

token_dict = {}
gas = 154819
gas_price = 50 * (10 ** 6)
cost = int(gas * gas_price * 1.5)

equipment_name_mapping = {
    '青梦': 'qingmeng',
    '黑唐衫': 'heitangshan',
    '刮胡刀': 'guahudao',
    '凤凰刃': 'fenghuangren',
    '双翼刃': 'shuangyiren',
    '枫叶刃': 'fengyeren',
}


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
                'character_info': character_info,
                'bundle_address': query_result['bundle_address']
            }
            print("login response: ", response_data)
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

        if mongo_client['user_info']['info_collection'].find_one(query1) \
                or mongo_client['user_info']['info_collection'].find_one(query2):
            return HttpResponseBadRequest("Duplicate register info.")
        else:
            insert_data = {
                'username': username,
                'password': password,
                'bundle_address': bundle_address
            }

            if not insert_data['password']:
                return HttpResponseBadRequest("Please enter a password.")

            mongo_client['user_info']['info_collection'].insert_one(insert_data)
            response_data = {
                'message': 'ok'
            }
            return JsonResponse(response_data, safe=False, status=200)


def logout(request):
    if request.method == 'POST':
        mongo_client = mongodb.get_client()
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        print(body)

        username = body['username']
        token = body['token']
        character_info = body['character_info']

        print("token dict: ", token_dict)

        if username not in token_dict or token != token_dict[username]:
            return HttpResponseBadRequest('Invalid token')
        else:
            myquery = {"username": username}
            new_values = {"$set": {"character_info": character_info}}
            print("logout saved: ", character_info)
            mongo_client['user_info']['info_collection'].update_one(myquery, new_values)  # 1 username <-> 1 char_info ??
            response_data = {
                'message': 'ok'
            }
        return JsonResponse(response_data, safe=False, status=200)


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
            mongo_client['user_info']['info_collection'].update_one(myquery, new_values)  # 1 username <-> 1 char_info ??
            response_data = {
                'message': 'ok'
            }
            return JsonResponse(response_data, safe=False, status=200)


# def pick_equipment(request):
#     """Handle picking equipment and putting it into the Blockchain"""
#
#     if request.method == 'POST':
#         body_unicode = request.body.decode('utf-8')
#         body = json.loads(body_unicode)
#         print(body)
#
#         username = body['username']
#         equipment = body['equipment']
#         token = body['token']
#
#         if username not in token_dict or token != token_dict[username]:
#             return HttpResponseBadRequest('Invalid token')
#
#         equipment_attribute = {}
#
#         if equipment == 'qingmeng':
#             attack = 0
#             power_hit = 0
#             defense = random.randint(20, 100)
#             magic_defense = random.randint(20, 100)
#             drop_time = time.time()
#             equipment_attribute = {
#                 "attack": attack,
#                 "power_hit": power_hit,
#                 "defense": defense,
#                 "magic_defense": magic_defense,
#                 "drop_time": drop_time
#             }
#
#         elif equipment == 'heitangshan':
#             attack = 0
#             power_hit = 0
#             defense = random.randint(50, 200)
#             magic_defense = random.randint(50, 200)
#             drop_time = time.time()
#             equipment_attribute = {
#                 "attack": attack,
#                 "power_hit": power_hit,
#                 "defense": defense,
#                 "magic_defense": magic_defense,
#                 "drop_time": drop_time
#             }
#
#         elif equipment == 'guahudao':
#             attack = random.randint(10, 50)
#             power_hit = random.randint(0, 10)
#             defense = 0
#             magic_defense = 0
#             drop_time = time.time()
#             equipment_attribute = {
#                 "attack": attack,
#                 "power_hit": power_hit,
#                 "defense": defense,
#                 "magic_defense": magic_defense,
#                 "drop_time": drop_time
#             }
#
#         elif equipment == 'fengyeren':
#             attack = random.randint(30, 100)
#             power_hit = random.randint(5, 25)
#             defense = 0
#             magic_defense = 0
#             drop_time = time.time()
#             equipment_attribute = {
#                 "attack": attack,
#                 "power_hit": power_hit,
#                 "defense": defense,
#                 "magic_defense": magic_defense,
#                 "drop_time": drop_time
#             }
#
#         elif equipment == 'shuangyiren':
#             attack = random.randint(70, 150)
#             power_hit = random.randint(15, 50)
#             defense = 0
#             magic_defense = 0
#             drop_time = time.time()
#             equipment_attribute = {
#                 "attack": attack,
#                 "power_hit": power_hit,
#                 "defense": defense,
#                 "magic_defense": magic_defense,
#                 "drop_time": drop_time
#             }
#         elif equipment == 'fenghuangren':
#             attack = random.randint(120, 220)
#             power_hit = random.randint(40, 100)
#             defense = 0
#             magic_defense = 0
#             drop_time = time.time()
#             equipment_attribute = {
#                 "attack": attack,
#                 "power_hit": power_hit,
#                 "defense": defense,
#                 "magic_defense": magic_defense,
#                 "drop_time": drop_time
#             }
#
#         response_data = equipment_attribute
#         return JsonResponse(response_data, safe=False, status=200)


# def add_balance(request):
#     """Handle adding balance to the Blockchain system"""
#     pass


def pick_equipment(request):
    """
    Handle querying current balance using bundle_address.
    Give random attributes for different equipments.
    Call createNFT for enough current balance.
    """

    def get_equipment(equipment):

        equipment_attribute = {}
        drop_time = int(time.time())

        if equipment == 'qingmeng':
            attack = 0
            power_hit = 0
            defense = random.randint(20, 100)
            magic_defense = random.randint(20, 100)
            equipment_attribute['attack'] = attack
            equipment_attribute['power_hit'] = power_hit
            equipment_attribute['defense'] = defense
            equipment_attribute['magic_defense'] = magic_defense
            equipment_attribute['drop_time'] = drop_time

        elif equipment == 'heitangshan':
            attack = 0
            power_hit = 0
            defense = random.randint(50, 200)
            magic_defense = random.randint(50, 200)
            equipment_attribute['attack'] = attack
            equipment_attribute['power_hit'] = power_hit
            equipment_attribute['defense'] = defense
            equipment_attribute['magic_defense'] = magic_defense
            equipment_attribute['drop_time'] = drop_time

        elif equipment == 'guahudao':
            attack = random.randint(10, 50)
            power_hit = random.randint(0, 10)
            defense = 0
            magic_defense = 0
            equipment_attribute['attack'] = attack
            equipment_attribute['power_hit'] = power_hit
            equipment_attribute['defense'] = defense
            equipment_attribute['magic_defense'] = magic_defense
            equipment_attribute['drop_time'] = drop_time

        elif equipment == 'fengyeren':
            attack = random.randint(30, 100)
            power_hit = random.randint(5, 25)
            defense = 0
            magic_defense = 0
            equipment_attribute['attack'] = attack
            equipment_attribute['power_hit'] = power_hit
            equipment_attribute['defense'] = defense
            equipment_attribute['magic_defense'] = magic_defense
            equipment_attribute['drop_time'] = drop_time

        elif equipment == 'shuangyiren':
            attack = random.randint(70, 150)
            power_hit = random.randint(15, 50)
            defense = 0
            magic_defense = 0
            equipment_attribute['attack'] = attack
            equipment_attribute['power_hit'] = power_hit
            equipment_attribute['defense'] = defense
            equipment_attribute['magic_defense'] = magic_defense
            equipment_attribute['drop_time'] = drop_time

        elif equipment == 'fenghuangren':
            attack = random.randint(120, 220)
            power_hit = random.randint(40, 100)
            defense = 0
            magic_defense = 0
            equipment_attribute['attack'] = attack
            equipment_attribute['power_hit'] = power_hit
            equipment_attribute['defense'] = defense
            equipment_attribute['magic_defense'] = magic_defense
            equipment_attribute['drop_time'] = drop_time

        return equipment_attribute

    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        print(body)

        username = body['username']
        token = body['token']
        equipment = equipment_name_mapping[body['equipment_name']]

        if username not in token_dict or token != token_dict[username]:
            return HttpResponseBadRequest('Invalid token')

        mongo_client = mongodb.get_client()
        query = {'username': username}
        query_result = mongo_client['user_info']['info_collection'].find_one(query)
        print(query_result)
        if not query_result:
            return HttpResponseBadRequest("Invalid login info")

        bundle_address = query_result['bundle_address']
        current_balance = web3_lib.selfBalance(bundle_address)

        if current_balance < cost:
            return HttpResponseBadRequest(json.dumps({
                'message': 'insufficient fund'
            }))
        else:
            attributes = get_equipment(equipment)
            print(cost)
            result = web3_lib.createNFT(
                receiver_address=bundle_address,
                name=body['equipment_name'],
                ATK=attributes['attack'],
                DEF=attributes['defense'],
                MAG=attributes['magic_defense'],
                POW=attributes['power_hit'],
                drop_time=attributes['drop_time'],
                cost=cost,
                gas=gas,
                gas_price=gas_price
            )

            if result:
                response_data = {
                    'message': "ok"
                }
                return JsonResponse(response_data, safe=False, status=200)
            else:
                return HttpResponseBadRequest("Failed to create NFT")


def query_equipment(request):
    """Handle querying current equipment of particular character"""
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        print(body)

        username = body['username']
        token = body['token']

        if username not in token_dict or token != token_dict[username]:
            return HttpResponseBadRequest('Invalid token')

        mongo_client = mongodb.get_client()
        query = {"username": username}
        query_result = mongo_client['user_info']['info_collection'].find_one(query)
        address = query_result['bundle_address']
        e_list = web3_lib.selfNFT(address)
        print(e_list)
        return_list = []
        for equip in e_list:
            if not equip[6]:
                return_list.append({
                    'id': equip[9],
                    'name': equip[0],
                    'attack': equip[1],
                    'defense': equip[2],
                    'magic_defense': equip[3],
                    'power_hit': equip[4]
                })
        response_data = {
            'equipment_list': return_list
        }
        return JsonResponse(response_data, safe=False, status=200)
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
