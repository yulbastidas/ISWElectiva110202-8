from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.exceptions import NotFound
from django.contrib.auth import get_user_model
from .serializers import UserSerializer

CustomUser = get_user_model()

# Vista para registrar nuevos usuarios
class UserRegisterView(APIView):
    permission_classes = [permissions.AllowAny]  # Permitir registro a cualquier usuario

    def post(self, request, *args, **kwargs):
        """Crea un nuevo usuario si el email no existe"""
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data.get("email")

            # Verificar si el email ya está registrado
            if CustomUser.objects.filter(email=email).exists():
                return Response(
                    {"error": "Este email ya está registrado."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = serializer.save()
            return Response(
                {
                    "message": "Usuario registrado exitosamente",
                    "usuario": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "user_type": getattr(user, "user_type", "N/A")  # Evitar error si no tiene user_type
                    }
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            {"error": "Datos inválidos", "detalles": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

# Vista para obtener detalles de un usuario
class UserDetailView(APIView):
    permission_classes = [permissions.AllowAny]  # Solo usuarios autenticados

    def get(self, request, user_id, *args, **kwargs):
        """Obtiene los detalles de un usuario por su ID"""
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            raise NotFound({"error": "Usuario no encontrado."})

        # Serializar los datos del usuario
        serializer = UserSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)

# Vista para eliminar un usuario
class UserDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Solo usuarios autenticados

    def delete(self, request, user_id, *args, **kwargs):
        """Elimina un usuario por su ID"""
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            raise NotFound({"error": "Usuario no encontrado."})

        # Eliminar el usuario
        user.delete()

        return Response({"message": "Usuario eliminado exitosamente."}, status=status.HTTP_204_NO_CONTENT)

class UserListView(APIView):
    permission_classes = [permissions.AllowAny]  # Ahora cualquiera puede ver la lista

    def get(self, request, *args, **kwargs):
        """Lista todos los usuarios registrados"""
        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
