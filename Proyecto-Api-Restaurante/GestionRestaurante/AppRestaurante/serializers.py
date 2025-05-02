import re
from rest_framework import serializers
from AppRestaurante.models import Plato, Pedido, ItemPedido

# SERIALIZADOR DE PLATO (ya existente)
class PlatoSerializer(serializers.ModelSerializer):
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
        fields = ['id', 'nombre', 'precio', 'descripcion', 'categoria', 'imagen']

    def validate_nombre(self, value):
        value = value.strip().title()
        if not re.match(r'^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$', value):
            raise serializers.ValidationError("El nombre del plato solo debe contener letras.")
        return value

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor a 0.")
        return value

# SERIALIZADOR DE ITEM DE PEDIDO
class ItemPedidoSerializer(serializers.ModelSerializer):
    plato_nombre = serializers.CharField(source='plato.nombre', read_only=True)
    plato_precio = serializers.DecimalField(source='plato.precio', max_digits=6, decimal_places=2, read_only=True)

    class Meta:
        model = ItemPedido
        fields = ['plato', 'plato_nombre', 'plato_precio', 'cantidad', 'precio_unitario', 'subtotal']

# SERIALIZADOR DE PEDIDO
class PedidoSerializer(serializers.ModelSerializer):
    items = ItemPedidoSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    usuario = serializers.PrimaryKeyRelatedField(read_only=True) # Para mostrar el ID del usuario

    class Meta:
        model = Pedido
        fields = ['id', 'usuario', 'fecha_pedido', 'total', 'items']

# SERIALIZADOR PARA CREAR PEDIDO (RECIBIR DATOS DEL FRONTEND)
class CrearPedidoItemSerializer(serializers.Serializer):  # Serializador para cada item del pedido
    plato_id = serializers.IntegerField()
    cantidad = serializers.IntegerField(min_value=1)
    precio_unitario = serializers.DecimalField(max_digits=6, decimal_places=2)

class CrearPedidoSerializer(serializers.Serializer):
    items = serializers.ListField(child=CrearPedidoItemSerializer()) # Usamos el serializador para cada item