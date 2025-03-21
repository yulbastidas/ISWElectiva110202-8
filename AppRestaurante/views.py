from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from AppRestaurante.models import Plato
from .serializers import PlatoSerializer

class PlatoApiView(APIView):
    
    def post(self, request, *args, **kwargs):
        data = {
            'nombre': request.data.get('nombre'),
            'descripcion': request.data.get('descripcion'),
            'precio': request.data.get('precio'),
            'categoria': request.data.get('categoria'),
        }
        serializer = PlatoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    #  obtener todos los platos
    def get(self, request, *args, **kwargs):
        platos = Plato.objects.all()
        serializer = PlatoSerializer(platos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PlatoDetailApiView(APIView):
    # obtener un plato específico
    def get(self, request, plato_id, *args, **kwargs):
        plato = get_object_or_404(Plato, id=plato_id)
        serializer = PlatoSerializer(plato)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    #  actualizar un plato
    def put(self, request, plato_id, *args, **kwargs):
        plato = get_object_or_404(Plato, id=plato_id)
        data = {
            'nombre': request.data.get('nombre', plato.nombre),
            'descripcion': request.data.get('descripcion', plato.descripcion),
            'precio': request.data.get('precio', plato.precio),
            'categoria': request.data.get('categoria', plato.categoria),
        }
        serializer = PlatoSerializer(instance=plato, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # eliminar un plato
    def delete(self, request, plato_id, *args, **kwargs):
        plato = get_object_or_404(Plato, id=plato_id)
        plato.delete()
        return Response({"mensaje": "Plato eliminado correctamente"}, status=status.HTTP_200_OK)