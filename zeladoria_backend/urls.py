# zeladoria_backend/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from salas.views import SalaViewSet, LimpezaViewSet

router = DefaultRouter()
router.register(r'salas', SalaViewSet)
router.register(r'limpezas', LimpezaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path("api/", include("salas.urls")),
] + router.urls
