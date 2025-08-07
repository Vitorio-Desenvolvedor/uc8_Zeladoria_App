from django.db import models
from django.contrib.auth.models import User

class Sala(models.Model):
    nome = models.CharField(max_length=100)
    bloco = models.CharField(max_length=50)
    capacidade = models.IntegerField()
    recursos = models.TextField()

    def __str__(self):
        return self.nome

class RegistroLimpeza(models.Model):
    sala = models.ForeignKey(Sala, on_delete=models.CASCADE, related_name='limpezas')
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    data_hora = models.DateTimeField(auto_now_add=True)
    observacao = models.TextField(blank=True)

    def __str__(self):
        return f"{self.sala.nome} - {self.data_hora.strftime('%d/%m/%Y %H:%M')}"
