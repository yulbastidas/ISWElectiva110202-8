from AppRestaurante.models import Plato
from rest_framework import serializers

class PlatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plato
        fields = ['id', 'nombre', 'descripcion', 'precio']
