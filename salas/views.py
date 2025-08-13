from rest_framework import viewsets, permissions
from .models import Sala, Limpeza
from .serializers import SalaSerializer, LimpezaSerializer

class SalaViewSet(viewsets.ModelViewSet):
    queryset = Sala.objects.all()
    serializer_class = SalaSerializer
    permission_classes = [permissions.IsAuthenticated]

class LimpezaViewSet(viewsets.ModelViewSet):
    queryset = Limpeza.objects.all()
    serializer_class = LimpezaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
