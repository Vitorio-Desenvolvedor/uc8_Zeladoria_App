from rest_framework import serializers
from .models import Sala, Limpeza

class SalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sala
        fields = '__all__'

class LimpezaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Limpeza
        fields = '__all__'
        read_only_fields = ['usuario', 'data_limpeza']
