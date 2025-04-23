# models_usuario.py
from django.db import models

class Usuario(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=50, default="N/A")

    def __str__(self):
        return self.username
