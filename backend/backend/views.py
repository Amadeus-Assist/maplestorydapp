import json
from django.http import JsonResponse
from django.shortcuts import render, redirect
from . import mongodb


def login(request):
    mongo_client = mongodb.get_client()
    response_data = mongo_client.list_databases()
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        print(body)

    return JsonResponse(response_data)


def index(request):
    pass
    return render(request, 'login/index.html')


def register(request):
    pass
    return render(request, 'login/register.html')


def logout(request):
    pass
    return redirect('/index/')
