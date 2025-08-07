from django.urls import path
from .views import RegistrarUsuario

urlpatterns = [
    path('registrar/', RegistrarUsuario.as_view(), name='registrar_usuario'),
]
