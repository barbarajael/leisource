from app.models import Disciplina, Ficheiro, Utilizador
from rest_framework import serializers

class UtilizadorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Utilizador
        fields = ('nome', 'mail', 'password') 

class DisciplinaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Disciplina
        fields = ('nome', 'abreviatura', 'ano')

class FicheiroSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Ficheiro
        fields = ('nome','ficheiro','disciplina')