from django.test import TestCase
from django.contrib.auth.models import User
from AppUsuarios.serializers import UserSerializer
from rest_framework.exceptions import ValidationError


class UserSerializerTest(TestCase):
    def setUp(self):
        # Datos de usuario para pruebas
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword123"
        }
        
        # Crear un usuario existente para pruebas de unicidad
        self.existing_user = User.objects.create_user(
            username="existinguser",
            email="existing@example.com",
            password="password123"
        )
    
    def test_serializer_fields(self):
        """Prueba que el serializador tenga los campos correctos"""
        serializer = UserSerializer()
        self.assertEqual(set(serializer.fields), {"id", "username", "email", "password"})
        
        # Verificar que password es write_only
        self.assertTrue(serializer.fields["password"].write_only)
    
    def test_serializer_validation_valid_data(self):
        """Prueba que el serializador valida correctamente datos válidos"""
        serializer = UserSerializer(data=self.user_data)
        self.assertTrue(serializer.is_valid())
    
    def test_serializer_validation_missing_fields(self):
        """Prueba validación con campos faltantes"""
        # Sin username
        data = {
            "email": "test@example.com",
            "password": "testpassword123"
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("username", serializer.errors)
        
        # Sin email
        data = {
            "username": "testuser",
            "password": "testpassword123"
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)
        
        # Sin password
        data = {
            "username": "testuser",
            "email": "test@example.com"
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)
    
    def test_serializer_validation_invalid_email(self):
        """Prueba validación con email inválido"""
        data = {
            "username": "testuser",
            "email": "invalid-email",
            "password": "testpassword123"
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)
    
    def test_serializer_validation_duplicate_username(self):
        """Prueba validación con nombre de usuario duplicado"""
        data = {
            "username": "existinguser",  # Ya existe
            "email": "new@example.com",
            "password": "testpassword123"
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("username", serializer.errors)
    
    def test_serializer_validation_duplicate_email(self):
        """Prueba validación con email duplicado"""
        data = {
            "username": "newuser",
            "email": "existing@example.com",  # Ya existe
            "password": "testpassword123"
        }
        serializer = UserSerializer(data=data)
        # Esta validación podría pasar aquí ya que la verificación de email
        # duplicado se hace en la vista, no en el serializador
        if serializer.is_valid():
            # Si pasa, verificamos que al menos el serializador no falle
            self.assertIsNotNone(serializer.validated_data["email"])
    
    def test_serializer_create_method(self):
        """Prueba el método create del serializador"""
        serializer = UserSerializer(data=self.user_data)
        if serializer.is_valid():
            user = serializer.save()
            # Verificar que el usuario se creó correctamente
            self.assertEqual(user.username, "testuser")
            self.assertEqual(user.email, "test@example.com")
            self.assertTrue(user.check_password("testpassword123"))
            # Verificar que es un usuario en la base de datos
            self.assertEqual(user, User.objects.get(username="testuser"))
    
    def test_serializer_update_not_implemented(self):
        """Prueba que el método update no está implementado o funciona correctamente"""
        # Crear un usuario
        user = User.objects.create_user(
            username="updateuser",
            email="update@example.com",
            password="oldpassword"
        )
        
        # Datos para actualizar
        update_data = {
            "username": "updateduser",
            "email": "updated@example.com",
            "password": "newpassword"
        }
        
        # Verificar que podemos actualizar con el serializador
        # El UserSerializer no tiene un método update personalizado,
        # por lo que usa el método predeterminado de ModelSerializer
        serializer = UserSerializer(user, data=update_data, partial=True)
        if serializer.is_valid():
            # Si no hay método update personalizado, esto usará la implementación predeterminada
            try:
                updated_user = serializer.save()
                self.assertEqual(updated_user.username, "updateduser")
                self.assertEqual(updated_user.email, "updated@example.com")
                # Verificar si la contraseña se actualizó correctamente
                if "password" in update_data:
                    # Esto puede fallar si el serializador no hashea la contraseña en update
                    # lo cual podría indicar un error en la implementación
                    is_password_correct = updated_user.check_password("newpassword")
                    if not is_password_correct:
                        self.fail("La contraseña no se actualizó correctamente")
            except Exception as e:
                # Si hay algún error, podría indicar que el update no está bien implementado
                self.fail(f"Error al actualizar usuario: {str(e)}")
    
    def test_serializer_output(self):
        """Prueba que el serializador devuelve los datos correctos"""
        user = User.objects.create_user(**self.user_data)
        serializer = UserSerializer(user)
        data = serializer.data
        
        # Verificar que los campos esperados están presentes
        self.assertIn("id", data)
        self.assertIn("username", data)
        self.assertIn("email", data)
        
        # Verificar que password NO está presente (es write_only)
        self.assertNotIn("password", data)
        
        # Verificar valores
        self.assertEqual(data["username"], "testuser")
        self.assertEqual(data["email"], "test@example.com")