# salas/serializers.py
from rest_framework import serializers
from .models import Sala, Limpeza
from django.contrib.auth import get_user_model

User = get_user_model()

class SalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sala
        fields = ['id', 'nome', 'descricao']

class LimpezaSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.CharField(source='usuario.username', read_only=True)
    sala_nome = serializers.CharField(source='sala.nome', read_only=True)

    class Meta:
        model = Limpeza
        fields = ['id', 'sala', 'sala_nome', 'usuario', 'usuario_nome', 'data_limpeza', 'observacao']
        read_only_fields = ['id', 'usuario', 'usuario_nome', 'sala_nome', 'data_limpeza']
