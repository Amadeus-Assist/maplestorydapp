import json
from django.http import JsonResponse


def handle_login(request):
    response_data = {
            'message': 'ok'
        }
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        print(body)

    return JsonResponse(response_data)


