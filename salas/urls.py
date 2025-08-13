from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SalaViewSet, RegistroLimpezaViewSet

router = DefaultRouter()
router.register(r'salas', SalaViewSet, basename='salas')
router.register(r'historico', RegistroLimpezaViewSet, basename='historico')

urlpatterns = [
    path('', include(router.urls)),
]
