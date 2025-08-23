from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class UsuarioTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testeuser",
            password="123456",
            email="teste@teste.com"
        )

    def test_login_usuario(self):
        response = self.client.post("/auth/jwt/create/", {
            "username": "testeuser",
            "password": "123456"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
