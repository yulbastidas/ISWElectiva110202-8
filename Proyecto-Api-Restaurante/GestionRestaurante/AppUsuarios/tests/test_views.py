from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from django.urls import reverse

CustomUser = get_user_model()

class UserViewsTests(APITestCase):

    def setUp(self):
        """Método que se ejecuta antes de cada test. Crea un usuario de prueba."""
        self.user_data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "password123",
        }
        self.user = CustomUser.objects.create_user(**self.user_data)
        self.user_id = self.user.id
        self.url_register = reverse("user-register")  # Cambiar a la URL correspondiente
        self.url_user_detail = reverse("user-detail", args=[self.user_id])
        self.url_user_list = reverse("user-list")
        self.url_user_delete = reverse("user-delete", args=[self.user_id])

    def test_user_register(self):
        """Test de registro de usuario"""
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123"
        }
        response = self.client.post(self.url_register, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Usuario registrado exitosamente")
        self.assertEqual(response.data["usuario"]["email"], "newuser@example.com")

    def test_user_register_email_exists(self):
        """Test de registro de usuario con un email que ya existe"""
        response = self.client.post(self.url_register, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Este email ya está registrado.", response.data["error"])

    def test_user_detail(self):
        """Test obtener los detalles de un usuario"""
        response = self.client.get(self.url_user_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user_data["email"])
        self.assertEqual(response.data["username"], self.user_data["username"])

    def test_user_detail_not_found(self):
        """Test obtener detalles de un usuario no existente"""
        invalid_id = self.user_id + 999
        url = reverse("user-detail", args=[invalid_id])
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Usuario no encontrado.", response.data["error"])

    def test_user_delete(self):
        """Test eliminar un usuario"""
        response = self.client.delete(self.url_user_delete, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertRaises(CustomUser.DoesNotExist, CustomUser.objects.get, id=self.user_id)

    def test_user_delete_not_found(self):
        """Test eliminar un usuario no existente"""
        invalid_id = self.user_id + 999
        url = reverse("user-delete", args=[invalid_id])
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Usuario no encontrado.", response.data["error"])

    def test_user_list(self):
        """Test obtener la lista de usuarios"""
        response = self.client.get(self.url_user_list, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)  # Verifica que haya al menos un usuario
