from django.urls import path
from .views import PlatoApiView

urlpatterns = [
    path('', PlatoApiView.as_view(), name='plato-list-create'),
    path('<str:nombre>/', PlatoApiView.as_view(), name='plato-detail'),
]
