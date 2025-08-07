from rest_framework import serializers
from .models import Sala, RegistroLimpeza

class SalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sala
        fields = '__all__'

class RegistroLimpezaSerializer(serializers.ModelSerializer):
    sala = SalaSerializer(read_only=True)
    
    class Meta:
        model = RegistroLimpeza
        fields = '__all__'
