# En AppUsuarios/urls.py
from django.urls import path
from .views import UserRegisterView, UserDetailView, UserDeleteView, UserListView
from rest_framework.authtoken.views import obtain_auth_token  # 👈 Importar login por token

urlpatterns = [
    path("registro/", UserRegisterView.as_view(), name="registro"),
    path("usuarios/", UserListView.as_view(), name="usuario_lista"),
    path("usuarios/<int:user_id>/", UserDetailView.as_view(), name="usuario_detalle"),
    path("usuarios/<int:user_id>/delete/", UserDeleteView.as_view(), name="usuario_eliminar"),
    
    
    # 👇 Aquí agregamos el login
    path("login/", obtain_auth_token, name="api_login"),
]
