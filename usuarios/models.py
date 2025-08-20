from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    # Campo extra opcional
    tipo = models.CharField(
        max_length=20,
        choices=[("admin", "Admin"), ("zelador", "Zelador")],
        default="zelador"
    )

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"

    def __str__(self):
        return self.username
