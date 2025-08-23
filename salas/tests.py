from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Sala, Limpeza

User = get_user_model()

class SalaTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="user1", password="123456")
        self.client.force_authenticate(user=self.user)
        self.sala = Sala.objects.create(nome="Sala 101")

    def test_listar_salas(self):
        response = self.client.get("/api/salas/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_registrar_limpeza(self):
        response = self.client.post("/api/limpezas/", {
            "sala": self.sala.id,
            "observacao": "Limpeza rápida"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Limpeza.objects.count(), 1)
