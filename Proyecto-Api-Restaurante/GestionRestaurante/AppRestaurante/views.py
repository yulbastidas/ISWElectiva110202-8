# AppRestaurante/views.py
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, authentication
from AppRestaurante.models import Plato, Pedido
from .serializers import PlatoSerializer, PedidoSerializer, CrearPedidoSerializer
from rest_framework.permissions import IsAuthenticated
import logging

logger = logging.getLogger(__name__)

# Vista de platos
class PlatoApiView(APIView):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.AllowAny]

    def get(self, request, nombre=None, *args, **kwargs):
        if nombre:
            plato = get_object_or_404(Plato, nombre=nombre)
            serializer = PlatoSerializer(plato)
            return Response({"message": "Plato encontrado", "plato": serializer.data}, status=status.HTTP_200_OK)

        platos = Plato.objects.all()
        serializer = PlatoSerializer(platos, many=True)
        return Response({"message": "Lista de platos", "platos": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = PlatoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Plato registrado exitosamente", "plato": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"error": "Datos inválidos", "detalles": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, nombre, *args, **kwargs):
        plato = get_object_or_404(Plato, nombre=nombre)
        serializer = PlatoSerializer(plato, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Plato actualizado correctamente", "plato": serializer.data}, status=status.HTTP_200_OK)
        return Response({"error": "Error en la actualización", "detalles": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, nombre, *args, **kwargs):
        plato = get_object_or_404(Plato, nombre=nombre)
        plato.delete()
        return Response({"message": "Plato eliminado correctamente"}, status=status.HTTP_200_OK)


# Vista para crear pedidos
class CrearPedidoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CrearPedidoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            try:
                pedido = serializer.save()
                pedido_serializer = PedidoSerializer(pedido)
                logger.info(f"Pedido creado exitosamente para el usuario {request.user.username}.")
                return Response(pedido_serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Error al crear el pedido: {str(e)}", exc_info=True)
                return Response({"error": "Error interno al crear el pedido."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        logger.warning(f"Datos inválidos al crear pedido: {serializer.errors}")
        return Response({"error": "Datos inválidos", "detalles": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
