from django.shortcuts import render


def catch_all(request):
    return render(request, 'index.html')