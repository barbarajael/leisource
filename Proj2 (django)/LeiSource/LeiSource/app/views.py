"""
Definition of views.
"""

from django.shortcuts import render
from django.http import HttpRequest
from django.template import RequestContext
from datetime import datetime
from app.models import Utilizador, Disciplina, Ficheiro
from rest_framework import viewsets
from app.serializers import DisciplinaSerializer, FicheiroSerializer, UtilizadorSerializer
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django import forms
from .forms import UserRegistrationForm


def index (request):
    """Renders the home page."""
    assert isinstance(request, HttpRequest)
    return render(request, 'app/index.html',)


def mainP (request):
    return render (request, 'app/main.html',)


# --- SIGN UP ---

def createAccount(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)

        if form.is_valid():
            userObj = form.cleaned_data
            username = userObj['username']
            email =  userObj['email']
            password =  userObj['password']

            if not (User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists()):
                # Save the user in the User table (Django authentication and registration)
                User.objects.create_user(username, email, password)
                user = authenticate(username = username, password = password)
                login(request, user)

                # Save the user in the Utilizador table (our database)
                utilizador = Utilizador(nome=username, mail=email, password=password)
                utilizador.save()

                return HttpResponseRedirect('/login')
            else:
                #raise forms.ValidationError('Looks like a username with that email or password already exists')
                return HttpResponse("<script>alert('Nome de utilizador ou palavra-passe indisponívies');window.location.href = '/createAccount'</script>")
    else:
        form = UserRegistrationForm()

    return render(request, 'app/createAccount.html', {'form' : form})



# --- USER ---

def userInicial (request):
    if request.user.username == 'lei':
        return render(request, 'app/admin/inicial.html')
    else:
        return render (request, 'app/user/paginaInicial.html')

def userPerfil (request):
    return render (request, 'app/user/perfil.html',)

def userUploadFile (request):
    return render (request, 'app/user/uploadfile.html',)


def user1ano (request):
    cadeiras1 = Disciplina.objects.filter(ano=1).order_by("nome")
    return render (request, 'app/user/1ano.html', {'disciplinas': cadeiras1})

def user2ano (request):
    cadeiras2 = Disciplina.objects.filter(ano=2).order_by("nome")
    return render (request, 'app/user/2ano.html', {'disciplinas': cadeiras2})

def user3ano (request):
    cadeiras3 = Disciplina.objects.filter(ano=3).order_by("nome")
    return render (request, 'app/user/3ano.html', {'disciplinas': cadeiras3})


# cadeiras 1 ano
def userAlga (request):
    return render (request, 'app/user/1ano/alga.html')
def userCalculo1 (request):
    return render (request, 'app/user/1ano/calculo1.html',)
def userCalculo2 (request):
    return render (request, 'app/user/1ano/calculo2.html',)
def userEf (request):
    return render (request, 'app/user/1ano/ef.html',)
def userFp (request):
    return render (request, 'app/user/1ano/fp.html',)
def userIac (request):
    return render (request, 'app/user/1ano/iac.html',)
def userItw (request):
    return render (request, 'app/user/1ano/itw.html',)
def userMas (request):
    return render (request, 'app/user/1ano/mas.html',)
def userMd (request):
    return render (request, 'app/user/1ano/md.html',)
def userPoo (request):
    return render (request, 'app/user/1ano/poo.html',)

# cadeiras 2 ano
def userAed (request):
    return render (request, 'app/user/2ano/aed.html',)
def userBd (request):
    return render (request, 'app/user/2ano/bd.html',)
def userComp (request):
    return render (request, 'app/user/2ano/c.html',)
def userCd (request):
    return render (request, 'app/user/2ano/cd.html',)
def userIhc (request):
    return render (request, 'app/user/2ano/ihc.html',)
def userMpei (request):
    return render (request, 'app/user/2ano/mpei.html',)
def userPds (request):
    return render (request, 'app/user/2ano/pds.html',)
def userRedes (request):
    return render (request, 'app/user/2ano/redes.html',)
def userSmu (request):
    return render (request, 'app/user/2ano/smu.html',)
def userSo (request):
    return render (request, 'app/user/2ano/so.html',)

# cadeiras 3 ano
def userApsei (request):
    return render (request, 'app/user/3ano/apsei.html',)
def userCbd (request):
    return render (request, 'app/user/3ano/cbd.html',)
def userE (request):
    return render (request, 'app/user/3ano/e.html',)
def userGe (request):
    return render (request, 'app/user/3ano/ge.html',)
def userIa (request):
    return render (request, 'app/user/3ano/ia.html',)
def userIcm (request):
    return render (request, 'app/user/3ano/icm.html',)
def userIes (request):
    return render (request, 'app/user/3ano/ies.html',)
def userPi (request):
    return render (request, 'app/user/3ano/pi.html',)
def userSio (request):
    return render (request, 'app/user/3ano/sio.html',)
def userTpw (request):
    return render (request, 'app/user/3ano/tpw.html',)
def userTqs (request):
    return render (request, 'app/user/3ano/tqs.html',)



# --- ADMIN ---

def adminInicial (request):
    return render (request, 'app/admin/inicial.html',)

def adminUsers (request):
    utilizadores = Utilizador.objects.all()
    return render (request, 'app/admin/users.html', {'users': utilizadores})



# --- GUEST ---

def guestInicial (request):
    return render (request, 'app/guest/inicial.html',)

def guestCad1 (request):
    cadeiras1 = Disciplina.objects.filter(ano=1).order_by("nome")
    return render (request, 'app/guest/1ano.html', {'discip1': cadeiras1})

def guestCad2 (request):
    cadeiras2 = Disciplina.objects.filter(ano=2).order_by("nome")
    return render (request, 'app/guest/2ano.html', {'discip2': cadeiras2})

def guestCad3 (request):
    cadeiras3 = Disciplina.objects.filter(ano=3).order_by("nome")
    return render (request, 'app/guest/3ano.html', {'discip3': cadeiras3})



# --- REST API ---

class UtilizadorViewSet(viewsets.ModelViewSet):
    """
    API endpoint para Utilizadores
    """
    queryset = Utilizador.objects.all()
    serializer_class = UtilizadorSerializer

class DisciplinaViewSet(viewsets.ModelViewSet):
    """
    API endpoint para Disciplinas
    """
    queryset = Disciplina.objects.all()
    serializer_class = DisciplinaSerializer

class FicheiroViewSet(viewsets.ModelViewSet):
    """
    API endpoint para Ficheiros
    """
    queryset = Ficheiro.objects.all()
    serializer_class = FicheiroSerializer