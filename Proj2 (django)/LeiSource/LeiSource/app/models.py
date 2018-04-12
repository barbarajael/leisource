"""
Definition of models.
"""

from django.db import models

class Utilizador (models.Model):
    nome = models.CharField(max_length = 70)
    mail = models.EmailField()
    password = models.CharField(max_length = 20)
    def __srt__(self):
        return self.nome

class Disciplina (models.Model):
    nome = models.CharField(max_length = 70)
    abreviatura = models.CharField(max_length = 10, default='')
    ano = models.SmallIntegerField(default = 1)
    def __srt__(self):
        return self.nome

class Ficheiro (models.Model):
    nome = models.CharField(max_length = 70)
    ficheiro = models.FileField(upload_to='ficheiros/', default='ficheiros/default.pdf')
    disciplina = models.ForeignKey(Disciplina) # OnyToMany relation --> Disciplina (1) : (M) Ficheiro 
    def __srt__(self):
        return self.nome


    

