from django.test import TestCase
from decimal import Decimal
from AppRestaurante.models import Plato

class PlatoModelTest(TestCase):
    def setUp(self):
        self.plato = Plato.objects.create(
            nombre="Pizza",
            descripcion="Pizza de queso",
            categoria="PRINCIPAL",
            precio=Decimal("25.00")  # Usar Decimal explícitamente para asegurar el tipo
        )

    def test_creacion_plato(self):
        self.assertEqual(self.plato.nombre, "Pizza")
        self.assertEqual(str(self.plato), "Pizza - PRINCIPAL")  # str debería devolver solo un string

    def test_precio_decimal(self):
        self.assertIsInstance(self.plato.precio, Decimal)
