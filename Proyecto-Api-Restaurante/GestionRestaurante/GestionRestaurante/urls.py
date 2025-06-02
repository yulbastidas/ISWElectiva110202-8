from django.contrib import admin
from django.urls import path, include
from django.contrib.staticfiles.storage import staticfiles_storage
from django.views.generic.base import RedirectView



urlpatterns = [  
    path('favicon.ico', RedirectView.as_view(url=staticfiles_storage.url('favicon.ico'))),
    path("admin/", admin.site.urls),
    path("api/restaurante/", include("AppRestaurante.urls")),
    path("api/usuarios/", include("AppUsuarios.urls")),
]