from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from usuarios.views import UsuarioViewSet
from salas.views import SalaViewSet, LimpezaViewSet, HistoricoLimpezaViewSet

router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'salas', SalaViewSet)
router.register(r'limpezas', LimpezaViewSet)
router.register(r'historico', HistoricoLimpezaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
]
