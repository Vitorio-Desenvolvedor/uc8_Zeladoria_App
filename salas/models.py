from django.db import models
from django.contrib.auth.models import User

class Sala(models.Model):
    nome = models.CharField(max_length=100)
    bloco = models.CharField(max_length=50)
    capacidade = models.IntegerField()
    recursos = models.TextField()

    def __str__(self):
        return self.nome

class HistoricoLimpeza(models.Model):
    sala = models.ForeignKey(Sala, on_delete=models.CASCADE, related_name='historico_limpezas')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    observacao = models.TextField(blank=True)
    data_limpeza = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sala.nome} - {self.usuario.username} - {self.data_limpeza}"
