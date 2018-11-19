from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect


def login_view(request, next='/'):
    if request.method == 'GET':
        credentials = {}
        for key, value in request.GET.items():
            credentials[key] = value
        user = authenticate(request, **credentials)
        if user:
            login(request, user)
            return HttpResponseRedirect(redirect_to=next)
        else:
            return HttpResponseRedirect(redirect_to='user:login', reason="Invalid Credentials!")
    else:
        HttpResponseRedirect(redirect_to='next')
