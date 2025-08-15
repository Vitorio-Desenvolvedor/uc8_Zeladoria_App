from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SalaViewSet, HistoricoLimpezaViewSet

router = DefaultRouter()
router.register(r'salas', SalaViewSet)
router.register(r'salas/historico', HistoricoLimpezaViewSet, basename='historico')

urlpatterns = [
    path('', include(router.urls)),
]
