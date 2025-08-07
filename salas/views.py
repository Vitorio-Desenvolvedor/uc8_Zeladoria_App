from rest_framework import viewsets, permissions
from .models import Sala, RegistroLimpeza
from .serializers import SalaSerializer, RegistroLimpezaSerializer

class SalaViewSet(viewsets.ModelViewSet):
    queryset = Sala.objects.all()
    serializer_class = SalaSerializer
    permission_classes = [permissions.IsAuthenticated]

class RegistroLimpezaViewSet(viewsets.ModelViewSet):
    queryset = RegistroLimpeza.objects.all().order_by('-data_hora')
    serializer_class = RegistroLimpezaSerializer
    permission_classes = [permissions.IsAuthenticated]
