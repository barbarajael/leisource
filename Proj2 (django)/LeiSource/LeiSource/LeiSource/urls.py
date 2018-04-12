"""
Definition of urls for LeiSource.
"""

from datetime import datetime
from django.conf.urls import url
import django.contrib.auth.views

# login
from django.contrib.auth import views as auth_views

# for web services
from rest_framework import routers
from app.views import UtilizadorViewSet
from app.views import DisciplinaViewSet
from app.views import FicheiroViewSet

import app.forms
import app.views

# Uncomment the next lines to enable the admin:
from django.conf.urls import include
from django.contrib import admin
admin.autodiscover()

# --- REST API ---
router = routers.DefaultRouter()
router.register(r'utilizadores', UtilizadorViewSet)
router.register(r'disciplinas', DisciplinaViewSet)
router.register(r'ficheiros',FicheiroViewSet)

urlpatterns = [
    # gerais
    url(r'^$', app.views.index, name='index'),
    url(r'^mainP', app.views.mainP, name='mainP'),
 

    # --- LOGIN ---
    url(r'^login/$', auth_views.login, {'template_name': 'app/login.html'}),


    # --- SIGN UP --
    url(r'^createAccount/$', app.views.createAccount, name='createAccount'),


    # --- USER ---
    url(r'^userInicial', app.views.userInicial, name='userInicial'),
    url(r'^userPerfil', app.views.userPerfil, name='userPerfil'),
    url(r'^userUploadFile', app.views.userUploadFile, name='userUploadFile'),
    url(r'^user1ano', app.views.user1ano, name='user1ano'),
    url(r'^user2ano', app.views.user2ano, name='user2ano'),
    url(r'^user3ano', app.views.user3ano, name='user3ano'),

    # cadeiras 1 ano
    url(r'^userAlga', app.views.userAlga, name='userAlga'),
    url(r'^userCalculo1', app.views.userCalculo1, name='userCalculo1'),
    url(r'^userCalculo2', app.views.userCalculo2, name='userCalculo2'),
    url(r'^userEf', app.views.userEf, name='userEf'),
    url(r'^userFp', app.views.userFp, name='userFp'),
    url(r'^userIac', app.views.userIac, name='userIac'),
    url(r'^userItw', app.views.userItw, name='userItw'),
    url(r'^userMas', app.views.userMas, name='userMas'),
    url(r'^userMd', app.views.userMd, name='userMd'),
    url(r'^userPoo', app.views.userPoo, name='userPoo'),

    # cadeiras 2 ano
    url(r'^userAed', app.views.userAed, name='userAed'),
    url(r'^userBd', app.views.userBd, name='userBd'),
    url(r'^userComp', app.views.userComp, name='userComp'),
    url(r'^userCd', app.views.userCd, name='userCd'),
    url(r'^userIhc', app.views.userIhc, name='userIhc'),
    url(r'^userMpei', app.views.userMpei, name='userMpei'),
    url(r'^userPds', app.views.userPds, name='userPds'),
    url(r'^userRedes', app.views.userRedes, name='userRedes'),
    url(r'^userSmu', app.views.userSmu, name='userSmu'),
    url(r'^userSo', app.views.userSo, name='userSo'),

    # cadeiras 3 ano
    url(r'^userApsei', app.views.userApsei, name='userApsei'),
    url(r'^userCbd', app.views.userCbd, name='userCbd'),
    url(r'^userE', app.views.userE, name='userE'),
    url(r'^userGe', app.views.userGe, name='userGe'),
    url(r'^userIa', app.views.userIa, name='userIa'),
    url(r'^userIcm', app.views.userIcm, name='userIcm'),
    url(r'^userIes', app.views.userIes, name='userIes'),
    url(r'^userPi', app.views.userPi, name='userPi'),
    url(r'^userSio', app.views.userSio, name='userSio'),
    url(r'^userTpw', app.views.userTpw, name='userTpw'),
    url(r'^userTqs', app.views.userTqs, name='userTqs'),


    # --- ADMIN ---
    url(r'^adminInicial', app.views.adminInicial, name='adminInicial'),
    url(r'^adminUsers', app.views.adminUsers, name='adminUsers'),


    # --- GUEST ---
    url(r'^guestInicial', app.views.guestInicial, name='guestInicial'),
    url(r'^guestCad1', app.views.guestCad1, name='guestCad1'),
    url(r'^guestCad2', app.views.guestCad2, name='guestCad2'),
    url(r'^guestCad3', app.views.guestCad3, name='guestCad3'),


    # --- REST API ---
    url(r'^', include(router.urls)),


    # ---------- django admin ----------

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
]
