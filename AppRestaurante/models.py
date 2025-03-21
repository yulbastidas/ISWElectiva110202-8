from django.db import models

# Create your models here.

class Plato(models.Model):
    CATEGORIAS = (
        ('1', 'ENTRADA'),
        ('2', 'PLATO FUERTE'),
        ('3', 'POSTRE'),
    )
    
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=6, decimal_places=2)
    categoria = models.CharField('Categoría', max_length=1, choices=CATEGORIAS)

    def __str__(self):
        return self.nombre
