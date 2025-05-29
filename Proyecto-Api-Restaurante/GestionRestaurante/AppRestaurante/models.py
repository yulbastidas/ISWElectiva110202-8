from django.db import models
from django.contrib.auth.models import User  # Importa el modelo de usuario de Django

# Modelo de Plato (ya existente)
class Plato(models.Model):
    TIPOS_CATEGORIA = (
        ('ENTRADA', 'Entrada'),
        ('PRINCIPAL', 'Principal'),
        ('POSTRE', 'Postre'),
        ('BEBIDA', 'Bebida'),
    )
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField()
    categoria = models.CharField(max_length=10, choices=TIPOS_CATEGORIA)
    precio = models.DecimalField(max_digits=6, decimal_places=2)
    imagen = models.URLField(blank=True, null=True)  # Nuevo campo para la URL de la imagen

    def __str__(self):
        return f"{self.nombre} - {self.get_categoria_display()}"

class Pedido(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    direccion_envio = models.TextField(blank=True, null=True)  # Nuevo campo para la dirección de envío
    # Puedes añadir más campos como estado_pedido, metodo_pago, comentarios, etc.

    def __str__(self):
        return f"Pedido #{self.id} - {self.fecha_pedido}"

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='items', on_delete=models.CASCADE)
    plato = models.ForeignKey(Plato, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=6, decimal_places=2)
    subtotal = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.cantidad} x {self.plato.nombre} en el Pedido #{self.pedido.id}"