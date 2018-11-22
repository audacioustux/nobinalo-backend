from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.urls import reverse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.conf import settings


def test(request):
    return HttpResponse("haha vodox")


def login_view(request, next=settings.LOGIN_REDIRECT_URL):
    if request.method == 'POST':
        credentials = {}
        for key, value in request.POST.items():
            credentials[key] = value
        user = authenticate(request, **credentials)
        if user:
            login(request, user)
            return redirect(next)
        else:
            return HttpResponse(request.META.HTTP_REFERER,)


@login_required
def logout_view(request):
    return logout(request)
