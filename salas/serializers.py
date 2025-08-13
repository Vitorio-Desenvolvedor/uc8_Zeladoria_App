from rest_framework import serializers
from .models import Sala, RegistroLimpeza

class SalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sala
        fields = ['id', 'nome', 'descricao', 'status']

class RegistroLimpezaSerializer(serializers.ModelSerializer):
    sala = serializers.CharField(source='sala.nome', read_only=True)
    usuario = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = RegistroLimpeza
        fields = ['id', 'sala', 'usuario', 'observacao', 'data_limpeza']
