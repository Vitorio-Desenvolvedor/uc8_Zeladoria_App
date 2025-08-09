from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny 
from rest_framework import viewsets
from .models import Limpeza
from .serializers import LimpezaSerializer
from .serializers import UserCreateSerializer

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
