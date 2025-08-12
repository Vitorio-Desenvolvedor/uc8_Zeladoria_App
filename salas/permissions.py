# salas/permissions.py
from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    """
    - Métodos seguros (GET, HEAD, OPTIONS) são permitidos a todos autenticados (ou True se preferir público).
    - Métodos de escrita (POST, PUT, PATCH, DELETE) apenas para staff.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
