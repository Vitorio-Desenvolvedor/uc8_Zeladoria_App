# salas/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Sala(models.Model):
    nome = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nome

class Limpeza(models.Model):
    sala = models.ForeignKey(Sala, on_delete=models.CASCADE, related_name='limpezas')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='limpezas')
    data = models.DateTimeField(auto_now_add=True)
    observacao = models.TextField(blank=True, default='')
    # status simples (opcional): realizado, pendente etc. Mantendo só um campo texto livre
    status = models.CharField(max_length=30, blank=True, default='realizado')

    class Meta:
        ordering = ['-data']  # mais recentes primeiro

    def __str__(self):
        return f'{self.sala.nome} - {self.data:%d/%m/%Y %H:%M}'
