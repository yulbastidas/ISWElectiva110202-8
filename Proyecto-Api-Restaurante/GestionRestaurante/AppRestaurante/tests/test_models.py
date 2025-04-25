from django.test import TestCase
from decimal import Decimal
from AppRestaurante.models import Plato

class PlatoModelTest(TestCase):
    def setUp(self):
        self.plato = Plato.objects.create(
            nombre="Pizza",
            descripcion="Pizza de queso",
            categoria="PRINCIPAL",
            precio=Decimal("25.00")
        )

    def test_creacion_plato(self):
        """Verifica que el plato se cree correctamente"""
        self.assertEqual(self.plato.nombre, "Pizza")
        self.assertEqual(self.plato.descripcion, "Pizza de queso")
        self.assertEqual(self.plato.categoria, "PRINCIPAL")
        self.assertEqual(self.plato.precio, Decimal("25.00"))

    def test_str_metodo(self):
        """Verifica que el método __str__ devuelve el formato correcto"""
        self.assertEqual(str(self.plato), "Pizza - PRINCIPAL")

    def test_precio_es_decimal(self):
        """Verifica que el campo precio sea de tipo Decimal"""
        self.assertIsInstance(self.plato.precio, Decimal)
