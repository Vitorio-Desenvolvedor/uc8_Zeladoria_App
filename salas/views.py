from rest_framework import viewsets, permissions
from rest_framework.pagination import PageNumberPagination
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware
from datetime import datetime
from .models import Sala, Limpeza
from .serializers import SalaSerializer, LimpezaSerializer

class DefaultPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'

class IsAdminOrReadOnly(permissions.BasePermission):
    """Permite apenas admin alterar; leitura liberada para autenticados."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff

class SalaViewSet(viewsets.ModelViewSet):
    queryset = Sala.objects.all()
    serializer_class = SalaSerializer
    permission_classes = [IsAdminOrReadOnly]

class LimpezaViewSet(viewsets.ModelViewSet):
    queryset = Limpeza.objects.select_related('sala', 'usuario').all()
    serializer_class = LimpezaSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = DefaultPagination

    def get_queryset(self):
        qs = super().get_queryset()
        sala_id = self.request.query_params.get('sala_id')
        if sala_id:
            qs = qs.filter(sala_id=sala_id)

        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        if date_from:
            dtf = parse_datetime(date_from) or make_aware(datetime.fromisoformat(date_from))
            qs = qs.filter(data__gte=dtf)
        if date_to:
            dtt = parse_datetime(date_to) or make_aware(datetime.fromisoformat(date_to))
            qs = qs.filter(data__lte=dtt)

        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(observacao__icontains=search)

        ordering = self.request.query_params.get('ordering')
        if ordering:
            qs = qs.order_by(ordering)
        return qs

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
