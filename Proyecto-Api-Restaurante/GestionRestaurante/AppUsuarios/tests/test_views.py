from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


class UserRegisterViewTest(APITestCase):
    def setUp(self):
        # Crear un usuario para probar duplicados
        self.existing_user = User.objects.create_user(
            username="existinguser",
            email="existing@example.com",
            password="password123"
        )
        
        # URLs para las pruebas
        self.register_url = reverse('registro')
    
    def test_registro_usuario_valido(self):
        """Prueba para registrar un usuario con datos válidos"""
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword123"
        }
        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["usuario"]["username"], "testuser")
        self.assertEqual(response.data["usuario"]["email"], "test@example.com")
        
        # Verificar que el usuario se creó correctamente en la base de datos
        self.assertTrue(User.objects.filter(username="testuser").exists())
    
    def test_registro_usuario_email_duplicado(self):
        """Prueba para registrar un usuario con email que ya existe"""
        data = {
            "username": "newuser",
            "email": "existing@example.com",  # Email ya registrado
            "password": "newpassword123"
        }
        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "Este email ya está registrado.")
    
    def test_registro_usuario_datos_invalidos(self):
        """Prueba para registrar un usuario con datos inválidos"""
        # Caso 1: Username vacío
        data = {
            "username": "",
            "email": "test@example.com",
            "password": "testpassword123"
        }
        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detalles", response.data)
        self.assertIn("username", response.data["detalles"])
        
        # Caso 2: Email inválido
        data = {
            "username": "testuser",
            "email": "invalid-email",
            "password": "testpassword123"
        }
        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detalles", response.data)
        self.assertIn("email", response.data["detalles"])
        
        # Caso 3: Sin password
        data = {
            "username": "testuser",
            "email": "test@example.com",
        }
        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detalles", response.data)
        self.assertIn("password", response.data["detalles"])


class UserDetailViewTest(APITestCase):
    def setUp(self):
        # Crear usuario para las pruebas
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpassword123"
        )
        
        # URL para las pruebas
        self.detail_url = reverse('usuario_detalle', args=[self.user.id])
    
    def test_obtener_usuario_existente(self):
        """Prueba para obtener detalles de un usuario existente"""
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "testuser")
        self.assertEqual(response.data["email"], "test@example.com")
    
    def test_obtener_usuario_inexistente(self):
        """Prueba para obtener detalles de un usuario que no existe"""
        non_existent_url = reverse('usuario_detalle', args=[9999])  # ID que no existe
        response = self.client.get(non_existent_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UserDeleteViewTest(APITestCase):
    def setUp(self):
        # Crear usuario para las pruebas
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpassword123"
        )
        
        # URL para las pruebas
        self.delete_url = reverse('usuario_eliminar', args=[self.user.id])
        
        # Crear token para autenticación
        self.token = Token.objects.create(user=self.user)
    
    def test_eliminar_usuario_sin_autenticacion(self):
        """Prueba para eliminar un usuario sin autenticación"""
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Verificar que el usuario aún existe
        self.assertTrue(User.objects.filter(id=self.user.id).exists())
    
    def test_eliminar_usuario_con_autenticacion(self):
        """Prueba para eliminar un usuario con autenticación"""
        # Configurar autenticación
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verificar que el usuario fue eliminado
        self.assertFalse(User.objects.filter(id=self.user.id).exists())
    
    def test_eliminar_usuario_inexistente(self):
        """Prueba para eliminar un usuario que no existe"""
        # Configurar autenticación
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        
        non_existent_url = reverse('usuario_eliminar', args=[9999])  # ID que no existe
        response = self.client.delete(non_existent_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UserListViewTest(APITestCase):
    def setUp(self):
        # Crear usuarios para las pruebas
        self.user1 = User.objects.create_user(
            username="user1",
            email="user1@example.com",
            password="password123"
        )
        
        self.user2 = User.objects.create_user(
            username="user2",
            email="user2@example.com",
            password="password123"
        )
        
        # URL para las pruebas
        self.list_url = reverse('usuario_lista')
    
    def test_listar_usuarios(self):
        """Prueba para listar todos los usuarios"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que la respuesta contiene los usuarios creados
        self.assertEqual(len(response.data), 2)
        usernames = [user["username"] for user in response.data]
        self.assertIn("user1", usernames)
        self.assertIn("user2", usernames)


class LoginViewTest(APITestCase):
    def setUp(self):
        # Crear usuario para las pruebas
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpassword123"
        )
        
        # URL para las pruebas
        self.login_url = reverse('api_login')
    
    def test_login_exitoso(self):
        """Prueba para un login exitoso"""
        data = {
            "username": "testuser",
            "password": "testpassword123"
        }
        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
    
    def test_login_fallido_credenciales_incorrectas(self):
        """Prueba para un login con credenciales incorrectas"""
        data = {
            "username": "testuser",
            "password": "wrongpassword"
        }
        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_login_fallido_usuario_inexistente(self):
        """Prueba para un login con usuario inexistente"""
        data = {
            "username": "nonexistentuser",
            "password": "testpassword123"
        }
        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)