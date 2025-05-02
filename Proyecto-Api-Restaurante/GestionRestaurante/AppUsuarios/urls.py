
from django.urls import path
from .views import UserRegisterView, UserDetailView, UserDeleteView, UserListView, LoginView  # ¡Asegúrate de que LoginView esté aquí!
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("registro/", UserRegisterView.as_view(), name="registro"),
    path("usuarios/", UserListView.as_view(), name="usuario_lista"),
    path("usuarios/<int:user_id>/", UserDetailView.as_view(), name="usuario_detalle"),
    path("usuarios/<int:user_id>/delete/", UserDeleteView.as_view(), name="usuario_eliminar"),


    # 👇 Aquí está el login para obtener el token
    path("login/", LoginView.as_view(), name="api_login"),
]