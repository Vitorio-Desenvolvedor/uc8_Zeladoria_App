from django.db import models
from usuarios.models import Usuario

class Sala(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome

class Limpeza(models.Model):
    sala = models.ForeignKey(Sala, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    observacao = models.TextField(blank=True, null=True)
    data = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Limpeza {self.sala.nome} - {self.usuario.username}"

class HistoricoLimpeza(models.Model):
    sala = models.ForeignKey(Sala, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    observacao = models.TextField(blank=True, null=True)
    data = models.DateTimeField()

    def __str__(self):
        return f"Histórico {self.sala.nome} - {self.usuario.username}"
