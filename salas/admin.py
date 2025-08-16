# salas/admin.py
from django.contrib import admin
from .models import Sala, Limpeza

@admin.register(Sala)
class SalaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome')
    search_fields = ('nome',)

@admin.register(Limpeza)
class LimpezaAdmin(admin.ModelAdmin):
    list_display = ('id', 'sala', 'usuario', 'data', 'status')
    list_filter = ('sala', 'status', 'data')
    search_fields = ('observacao', 'sala__nome', 'usuario__username')
    ordering = ('-data',)
