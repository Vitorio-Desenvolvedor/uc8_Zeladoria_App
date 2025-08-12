from rest_framework import viewsets, permissions, generics, filters
from rest_framework.authentication import TokenAuthentication
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Sala, Limpeza
from .serializers import SalaSerializer, LimpezaSerializer
from .permissions import IsAdminOrReadOnly
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class SalaViewSet(viewsets.ModelViewSet):
    queryset = Sala.objects.all().order_by('nome')
    serializer_class = SalaSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminOrReadOnly]

class LimpezaViewSet(viewsets.ModelViewSet):
    """
    - POST: qualquer usuário autenticado pode registrar limpeza (usuario será o request.user)
    - GET (list/retrieve), PUT/PATCH/DELETE: apenas admins
    """
    queryset = Limpeza.objects.all().order_by('-data_limpeza')
    serializer_class = LimpezaSerializer
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()] # Para listar/detalhar/alterar/excluir, somente admin
        return [IsAdminUser()]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class HistoricoList(generics.ListAPIView):
    serializer_class = LimpezaSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['sala', 'usuario'] 
    search_fields = ['observacao', 'sala__nome', 'usuario__username']
    ordering_fields = ['data_limpeza']
    ordering = ['-data_limpeza']

    def get_queryset(self):
        queryset = Limpeza.objects.all().order_by('-data_limpeza')
        data = self.request.query_params.get('data')
        if data:
            queryset = queryset.filter(data_limpeza__date=data)
        return queryset
