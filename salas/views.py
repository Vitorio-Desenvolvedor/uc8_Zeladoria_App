from rest_framework import viewsets, permissions
from .models import Sala, RegistroLimpeza
from .serializers import SalaSerializer, RegistroLimpezaSerializer

# Apenas admins podem alterar salas
class SalaViewSet(viewsets.ModelViewSet):
    queryset = Sala.objects.all()
    serializer_class = SalaSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

# Histórico de Limpezas — somente admins podem ver
class RegistroLimpezaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RegistroLimpeza.objects.all().order_by('-data_limpeza')
    serializer_class = RegistroLimpezaSerializer
    permission_classes = [permissions.IsAdminUser]
