# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-06-06 10:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_disciplina_abreviatura'),
    ]

    operations = [
        migrations.AddField(
            model_name='disciplina',
            name='ano',
            field=models.SmallIntegerField(default=0),
        ),
    ]
