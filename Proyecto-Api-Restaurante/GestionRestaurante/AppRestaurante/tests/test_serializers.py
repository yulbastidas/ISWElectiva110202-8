from django.test import TestCase
from AppRestaurante.serializers import PlatoSerializer
from AppRestaurante.models import Plato

class PlatoSerializerTest(TestCase):

    def test_serializer_valid_data(self):
        data = {
            "nombre": "Lomo saltado",
            "precio": 20.50,
            "descripcion": "Delicioso plato peruano",
        }
        serializer = PlatoSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_serializer_nombre_vacio(self):
        data = {
            "nombre": "  ",
            "precio": 18.00,
            "descripcion": "Nombre vacío"
        }
        serializer = PlatoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('nombre', serializer.errors)
        self.assertEqual(serializer.errors['nombre'][0], "El nombre del plato no puede estar vacío.")

    def test_serializer_nombre_invalido(self):
        data = {
            "nombre": "12345!!!",
            "precio": 18.00,
            "descripcion": "Nombre inválido"
        }
        serializer = PlatoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('nombre', serializer.errors)
        self.assertIn("El nombre del plato solo debe contener letras.", serializer.errors['nombre'][0])

    def test_serializer_precio_invalido(self):
        data = {
            "nombre": "Pollo Asado",
            "precio": 0.00,
            "descripcion": "Precio inválido"
        }
        serializer = PlatoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('precio', serializer.errors)
        self.assertEqual(serializer.errors['precio'][0], "El precio debe ser mayor a 0.")

    def test_serializer_output_categoria(self):
        plato = Plato.objects.create(
            nombre="Arepa",
            descripcion="Arepa con queso",
            categoria="ENTRADA",
            precio=5.00
        )
        serializer = PlatoSerializer(plato)
        self.assertEqual(serializer.data['categoria'], "Entrada")
