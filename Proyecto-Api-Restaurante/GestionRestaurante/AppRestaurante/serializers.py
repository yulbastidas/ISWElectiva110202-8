import re
from rest_framework import serializers
from AppRestaurante.models import Plato, Pedido, ItemPedido

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


class ItemPedidoSerializer(serializers.ModelSerializer):
    # Eliminamos los campos innecesarios para la creación de un pedido.
    class Meta:
        model = ItemPedido
        fields = ['plato', 'cantidad', 'precio_unitario', 'subtotal']


class PedidoSerializer(serializers.ModelSerializer):
    items = ItemPedidoSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    usuario = serializers.PrimaryKeyRelatedField(read_only=True)
    direccion_envio = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = Pedido
        fields = ['id', 'usuario', 'fecha_pedido', 'total', 'items', 'direccion_envio']


class CrearPedidoItemSerializer(serializers.Serializer):
    plato_id = serializers.IntegerField()
    cantidad = serializers.IntegerField(min_value=1)

    def validate_plato_id(self, value):
        # Asegurarse de que el plato exista.
        if not Plato.objects.filter(id=value).exists():
            raise serializers.ValidationError(f"No existe ningún plato con ID {value}.")
        return value


class CrearPedidoSerializer(serializers.Serializer):
    items = serializers.ListField(
        child=CrearPedidoItemSerializer(),
        allow_empty=False,
        error_messages={
            'required': 'Debes enviar al menos un ítem en el pedido.',
            'blank': 'La lista de items no puede estar vacía.',
            'null': 'La lista de items no puede ser nula.'
        }
    )
    direccion_envio = serializers.CharField(allow_blank=True, required=False)

    def create(self, validated_data):
        # Obtener el usuario autenticado (o None si es anónimo)
        request = self.context.get('request')
        usuario = request.user if request and request.user.is_authenticated else None

        # Extraer los datos
        direccion_envio = validated_data.pop('direccion_envio', '')
        items_data = validated_data.pop('items')

        # Crear el pedido
        pedido = Pedido.objects.create(usuario=usuario, direccion_envio=direccion_envio)

        total_pedido = 0
        for item_data in items_data:
            plato = Plato.objects.get(pk=item_data['plato_id'])
            subtotal = item_data['cantidad'] * plato.precio
            ItemPedido.objects.create(
                pedido=pedido,
                plato=plato,
                cantidad=item_data['cantidad'],
                precio_unitario=plato.precio,
                subtotal=subtotal
            )
            total_pedido += subtotal

        pedido.total = total_pedido
        pedido.save()
        return pedido
