from rest_framework import serializers
from .models import Sala, Limpeza

class SalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sala
        fields = "__all__"


class LimpezaSerializer(serializers.ModelSerializer):
    sala_nome = serializers.CharField(source="sala.nome", read_only=True)

    class Meta:
        model = Limpeza
        fields = ["id", "sala", "sala_nome", "usuario", "observacao", "status", "data"]
