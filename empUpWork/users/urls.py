from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path

from .views import *

urlpatterns = [
    path('registration/', registration, name='registration'),
    path('wedding/', wedding, name='wedding'),
    path('Hotel/', Hotel, name='Hotel'),
    path('Restaurants/', Restaurants, name='Restaurants'),
    path('Lelase/', Lelase, name='Lelase'),
    path('Types/', Types, name='Types'),
    path('Order/', Order, name='Order'),
    path('profile/', updateProfile, name='updateProfile'),

    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(template_name='registration/logout.html'), name='logout'),
    path('updateProfile/', profile, name='profile')
]