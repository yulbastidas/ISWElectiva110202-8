
from django.urls import path
from .views import PlatoApiView, CrearPedidoView

urlpatterns = [
    path('', PlatoApiView.as_view(), name='plato-list-create'),
    path('<str:nombre>/', PlatoApiView.as_view(), name='plato-detail'),
    path('pedidos/', CrearPedidoView.as_view(), name='crear-pedido'),
]