# Backend/routeopt/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('optimize-route/', views.optimize_route, name='optimize_route'),
]
