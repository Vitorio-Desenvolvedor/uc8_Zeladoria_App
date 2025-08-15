from rest_framework import serializers
from .models import Sala, Limpeza, HistoricoLimpeza

class SalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sala
        fields = '__all__'

class LimpezaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Limpeza
        fields = '__all__'

class HistoricoLimpezaSerializer(serializers.ModelSerializer):
    sala_nome = serializers.CharField(source='sala.nome', read_only=True)
    usuario_nome = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = HistoricoLimpeza
        fields = ['id', 'sala_nome', 'usuario_nome', 'observacao', 'data']
