from rest_framework import viewsets, permissions
from .models import Sala, Limpeza
from .serializers import SalaSerializer, LimpezaSerializer

# View para as Salas
class SalaViewSet(viewsets.ModelViewSet):
    queryset = Sala.objects.all()
    serializer_class = SalaSerializer
    permission_classes = [permissions.IsAuthenticated]


# View para as Limpezas
class LimpezaViewSet(viewsets.ModelViewSet):
    queryset = Limpeza.objects.all().order_by("-data")
    serializer_class = LimpezaSerializer
    permission_classes = [permissions.IsAuthenticated]


# View para Histórico de Limpezas (separada, para administradores)
class HistoricoLimpezaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Exibe todo o histórico de limpezas. Apenas admins têm acesso.
    """
    queryset = Limpeza.objects.all().order_by("-data")
    serializer_class = LimpezaSerializer
    permission_classes = [permissions.IsAdminUser]
