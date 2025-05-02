from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, authentication
from AppRestaurante.models import Plato, Pedido, ItemPedido
from .serializers import PlatoSerializer, PedidoSerializer, CrearPedidoSerializer
from rest_framework.permissions import IsAuthenticated  # O la política de permisos que necesites

# GESTIÓN DE PLATOS (ya existente)
class PlatoApiView(APIView):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.AllowAny]
    # ... (tus métodos get, post, put, delete de Plato tal cual están)
    def get(self, request, nombre=None, *args, **kwargs):
        """Obtener un plato o la lista de todos los platos"""
        if nombre:
            plato = get_object_or_404(Plato, nombre=nombre)
            serializador = PlatoSerializer(plato)
            return Response({"message": "Plato encontrado", "plato": serializador.data}, status=status.HTTP_200_OK)

        platos = Plato.objects.all()
        serializador = PlatoSerializer(platos, many=True)
        return Response({"message": "Lista de platos", "platos": serializador.data}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """Crea un nuevo plato"""
        serializer = PlatoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Plato registrado exitosamente", "plato": serializer.data},
                status=status.HTTP_201_CREATED
            )

        return Response(
            {"error": "Datos inválidos", "detalles": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    def put(self, request, nombre, *args, **kwargs):
        """Actualiza un plato existente"""
        plato = get_object_or_404(Plato, nombre=nombre)
        serializer = PlatoSerializer(plato, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Plato actualizado correctamente", "plato": serializer.data},
                status=status.HTTP_200_OK
            )

        return Response(
            {"error": "Error en la actualización", "detalles": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, nombre, *args, **kwargs):
        """Elimina un plato por su nombre"""
        plato = get_object_or_404(Plato, nombre=nombre)
        plato.delete()
        return Response({"message": "Plato eliminado correctamente"}, status=status.HTTP_200_OK)

# GESTIÓN DE PEDIDOS
class CrearPedidoView(APIView):
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden crear pedidos (ajusta según tu necesidad)

    def post(self, request):
        serializer = CrearPedidoSerializer(data=request.data)
        if serializer.is_valid():
            pedido = Pedido(usuario=request.user)
            pedido.save()
            total_pedido = 0

            for item_data in serializer.validated_data['items']:
                plato_id = item_data['plato_id']
                cantidad = item_data['cantidad']
                precio_unitario = item_data['precio_unitario']

                try:
                    plato = Plato.objects.get(pk=plato_id)
                except Plato.DoesNotExist:
                    pedido.delete()  # Si un plato no existe, elimina el pedido incompleto
                    return Response({'error': f'El plato con ID {plato_id} no existe.'}, status=status.HTTP_400_BAD_REQUEST)

                item_pedido = ItemPedido(
                    pedido=pedido,
                    plato=plato,
                    cantidad=cantidad,
                    precio_unitario=precio_unitario
                )
                item_pedido.save()
                total_pedido += item_pedido.subtotal

            pedido.total = total_pedido
            pedido.save()
            pedido_serializer = PedidoSerializer(pedido)
            return Response(pedido_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)