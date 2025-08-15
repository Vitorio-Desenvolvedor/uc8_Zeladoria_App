from django.contrib import admin
from .models import Sala, Limpeza, HistoricoLimpeza

@admin.register(Sala)
class SalaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome')

@admin.register(Limpeza)
class LimpezaAdmin(admin.ModelAdmin):
    list_display = ('id', 'sala', 'usuario', 'data')

@admin.register(HistoricoLimpeza)
class HistoricoLimpezaAdmin(admin.ModelAdmin):
    list_display = ('id', 'sala', 'usuario', 'data')
