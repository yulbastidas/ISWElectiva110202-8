from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, authentication
from AppRestaurante.models import Plato  
from .serializers import PlatoSerializer

#  GESTIÓN DE PLATOS 
class PlatoApiView(APIView):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.AllowAny]

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
