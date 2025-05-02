from django.db import models

# Modelo de Plato
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
        return f"{self.nombre} - {self.categoria}"