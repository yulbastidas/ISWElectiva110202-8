import re
from rest_framework import serializers
from AppRestaurante.models import Plato  # Se ajusta al nuevo nombre de la app y modelo

# SERIALIZADOR DE PLATO
class PlatoSerializer(serializers.ModelSerializer):
    categoria = serializers.CharField(source='get_categoria_display', read_only=True)

    class Meta:
        model = Plato
        fields = ['id', 'nombre', 'precio', 'descripcion', 'categoria']

    def validate_nombre(self, value):
        """Validar que el nombre no esté vacío y tenga formato adecuado."""
        value = value.strip().title()
        if not value:
            raise serializers.ValidationError("El nombre del plato no puede estar vacío.")
        if not re.match(r'^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$', value):
            raise serializers.ValidationError("El nombre del plato solo debe contener letras.")
        return value

    def validate_precio(self, value):
        """Validar que el precio sea mayor a 0."""
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor a 0.")
        return value
