from django.urls import path
from .views import PlatoApiView, PlatoDetailApiView

urlpatterns = [
    path('api/crear/', PlatoApiView.as_view(), name='crear-plato'),
    path('api/platos/', PlatoApiView.as_view(), name='listar-platos'),
    path('api/platos/<int:plato_id>/', PlatoDetailApiView.as_view(), name='detalle-plato'),
]