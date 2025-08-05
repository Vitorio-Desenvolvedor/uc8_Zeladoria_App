from rest_framework import serializers
from .models import HistoricoLimpeza

class HistoricoLimpezaSerializer(serializers.ModelSerializer):
    sala = serializers.StringRelatedField()
    usuario = serializers.StringRelatedField()

    class Meta:
        model = HistoricoLimpeza
        fields = ['id', 'sala', 'usuario', 'observacao', 'data_limpeza']
