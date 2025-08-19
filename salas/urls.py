from rest_framework.routers import DefaultRouter
from .views import SalaViewSet, LimpezaViewSet, HistoricoLimpezaViewSet

router = DefaultRouter()
router.register(r"salas", SalaViewSet)
router.register(r"limpezas", LimpezaViewSet)
router.register(r"historico", HistoricoLimpezaViewSet, basename="historico")

urlpatterns = router.urls
