from rest_framework import generics, permissions
from .models import HistoricoLimpeza
from .serializers import HistoricoLimpezaSerializer

class HistoricoLimpezaListView(generics.ListAPIView):
    queryset = HistoricoLimpeza.objects.all().order_by('-data_limpeza')
    serializer_class = HistoricoLimpezaSerializer
    permission_classes = [permissions.IsAuthenticated]
