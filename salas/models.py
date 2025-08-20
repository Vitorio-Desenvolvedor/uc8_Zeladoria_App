from django.db import models
from django.conf import settings

class Sala(models.Model):
    nome = models.CharField(max_length=100)
    localizacao = models.CharField(max_length=100)
    capacidade = models.IntegerField()

    def __str__(self):
        return self.nome

class Limpeza(models.Model):
    sala = models.ForeignKey(Sala, on_delete=models.CASCADE, related_name="limpezas")
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="limpezas")
    data = models.DateTimeField(auto_now_add=True)
    observacao = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=[("pendente", "Pendente"), ("concluida", "Concluída")],
        default="pendente"
    )

    def __str__(self):
        return f"{self.sala.nome} - {self.status} em {self.data}"
