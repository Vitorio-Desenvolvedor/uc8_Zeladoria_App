from rest_framework import routers
from .views import SalaViewSet, LimpezaViewSet

router = routers.DefaultRouter()
router.register(r'salas', SalaViewSet)
router.register(r'limpezas', LimpezaViewSet)

urlpatterns = router.urls
