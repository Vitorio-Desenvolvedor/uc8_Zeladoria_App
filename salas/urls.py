from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SalaViewSet, LimpezaViewSet, HistoricoList

router = DefaultRouter()
router.register(r'salas', SalaViewSet, basename='salas')
router.register(r'limpezas', LimpezaViewSet, basename='limpezas')

urlpatterns = [
    path('', include(router.urls)),
    path('historico/', HistoricoList.as_view(), name='historico-limpezas'),  # /api/historico/
]
