from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.urls import reverse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.conf import settings
from nobinalo.views import catch_all


def test(request):
    return HttpResponse("haha vodox")


def login_view(request):
    if request.method == 'POST':
        credentials = {}
        for key, value in request.POST.items():
            credentials[key] = value
        credentials.pop("csrfmiddlewaretoken")
        try:
            next = credentials.pop("next")
        except KeyError:
            next = settings.LOGIN_REDIRECT_URL
        user = authenticate(request, **credentials)
        if user:
            login(request, user)
            return redirect(next)
            
    return catch_all(request)


@login_required
def logout_view(request):
    return logout(request)
