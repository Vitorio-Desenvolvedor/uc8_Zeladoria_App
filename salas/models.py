from django.db import models
from django.contrib.auth.models import User

class Sala(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    status_limpeza = models.BooleanField(default=False)

    def __str__(self):
        return self.nome

class Limpeza(models.Model):
    sala = models.ForeignKey(Sala, on_delete=models.CASCADE, related_name="limpezas")
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    observacao = models.TextField(blank=True)
    data_limpeza = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sala.nome} - {self.data_limpeza.strftime('%d/%m/%Y %H:%M')}"
