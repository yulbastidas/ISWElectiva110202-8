import re
from rest_framework import serializers
from AppRestaurante.models import Plato

# SERIALIZADOR DE PLATO
class PlatoSerializer(serializers.ModelSerializer):
    # Reescribimos el campo nombre para controlar el mensaje de error de "blank"
    nombre = serializers.CharField(
        allow_blank=False,
        error_messages={
            'blank': 'El nombre del plato no puede estar vacío.',
            'required': 'El campo nombre es obligatorio.'
        }
    )

    categoria = serializers.CharField(source='get_categoria_display', read_only=True)

    class Meta:
        model = Plato
        fields = ['id', 'nombre', 'precio', 'descripcion', 'categoria', 'imagen'] # Agregamos 'imagen' aquí

    def validate_nombre(self, value):
        """Validar que el nombre tenga formato adecuado."""
        value = value.strip().title()

        # Ya validamos 'blank' arriba, así que aquí solo validamos formato
        if not re.match(r'^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$', value):
            raise serializers.ValidationError("El nombre del plato solo debe contener letras.")
        return value

    def validate_precio(self, value):
        """Validar que el precio sea mayor a 0."""
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor a 0.")
        return value