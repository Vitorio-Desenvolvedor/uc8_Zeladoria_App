from rest_framework import viewsets, permissions
from .models import Sala
from .serializers import SalaSerializer
from historico.models import HistoricoLimpeza
from historico.serializers import HistoricoLimpezaSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class SalaViewSet(viewsets.ModelViewSet):
    queryset = Sala.objects.all()
    serializer_class = SalaSerializer
    permission_classes = [IsAdminOrReadOnly]

class HistoricoLimpezaViewSet(viewsets.ModelViewSet):
    serializer_class = HistoricoLimpezaSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return HistoricoLimpeza.objects.all()
        return HistoricoLimpeza.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
