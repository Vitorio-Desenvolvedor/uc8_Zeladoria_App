from django.urls import path
from .views import HistoricoLimpezaListView
from django.urls import path, include

urlpatterns = [
    path('api/', include('salas.urls')), 
]


urlpatterns = [
    path('limpezas/', HistoricoLimpezaListView.as_view(), name='lista_limpezas'),
]

urlpatterns = [
    path('salas/', SalaListCreateView.as_view(), name='salas'),
]