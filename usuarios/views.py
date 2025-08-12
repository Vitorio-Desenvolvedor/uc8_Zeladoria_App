from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny 
from rest_framework import viewsets

from .models import Limpeza
from .serializers import LimpezaSerializer
from .serializers import UserCreateSerializer

from rest_framework.permissions import IsAdminUser
from rest_framework import generics
from .models import RegistroLimpeza
from .serializers import RegistroLimpezaSerializer


class RegistroLimpezaViewSet(viewsets.ModelViewSet):
    queryset = RegistroLimpeza.objects.all().order_by('-data')
    serializer_class = RegistroLimpezaSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]
    
class HistoricoLimpezasList(generics.ListAPIView):
    serializer_class = RegistroLimpezaSerializer

    def get_queryset(self):
        queryset = RegistroLimpeza.objects.all()
        sala = self.request.query_params.get('sala')
        data = self.request.query_params.get('data')

        if sala:
            queryset = queryset.filter(sala__nome__icontains=sala)
        if data:
            queryset = queryset.filter(data__date=data)

        return queryset

class HistoricoLimpezasView(generics.ListAPIView):
    queryset = RegistroLimpeza.objects.all()
    serializer_class = RegistroLimpezaSerializer
    permission_classes = [IsAdminUser]


class LimpezaViewSet(viewsets.ModelViewSet):
    queryset = Limpeza.objects.all()
    serializer_class = LimpezaSerializer
    
class RegistrarUsuario(APIView):
    permission_classes = [AllowAny]  # Acesso público

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mensagem": "Usuário criado com sucesso!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_queryset(self):
        queryset = Limpeza.objects.all()
        sala_id = self.request.query_params.get('sala')
        if sala_id:
            queryset = queryset.filter(sala_id=sala_id)
        return queryset
