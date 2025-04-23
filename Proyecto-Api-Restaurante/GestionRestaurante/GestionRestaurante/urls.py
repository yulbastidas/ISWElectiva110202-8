from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/restaurante/", include("AppRestaurante.urls")),  # ← muy importante

    path("api/usuarios/", include("AppUsuarios.urls")), 
]
