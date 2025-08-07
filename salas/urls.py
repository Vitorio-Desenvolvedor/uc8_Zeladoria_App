from rest_framework.routers import DefaultRouter
from .views import SalaViewSet, RegistroLimpezaViewSet

router = DefaultRouter()
router.register(r'salas', SalaViewSet)
router.register(r'limpezas', RegistroLimpezaViewSet)

urlpatterns = router.urls
