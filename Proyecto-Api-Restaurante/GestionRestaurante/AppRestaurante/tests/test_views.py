from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from AppRestaurante.models import Plato

class PlatoApiViewTest(APITestCase):

    def setUp(self):
        self.plato = Plato.objects.create(
            nombre="Arepa",
            descripcion="Arepa con queso",
            precio=3500
        )
        self.url_lista = reverse('plato-list-create')  # Nombre correcto para la lista de platos
        self.url_detalle = reverse('plato-detail', args=[self.plato.nombre])  # Nombre correcto para el detalle del plato

    def test_get_lista_platos(self):
        response = self.client.get(self.url_lista)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('platos', response.data)

    def test_get_plato_por_nombre(self):
        response = self.client.get(self.url_detalle)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['plato']['nombre'], self.plato.nombre)

    def test_post_crear_plato(self):
        data = {
            "nombre": "Empanada",
            "descripcion": "Empanada de carne",
            "precio": 2500
        }
        response = self.client.post(self.url_lista, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['plato']['nombre'], "Empanada")

    def test_put_actualizar_plato(self):
        data = {
            "descripcion": "Arepa rellena de queso"
        }
        response = self.client.put(self.url_detalle, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['plato']['descripcion'], "Arepa rellena de queso")

    def test_delete_plato(self):
        response = self.client.delete(self.url_detalle)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], "Plato eliminado correctamente")
