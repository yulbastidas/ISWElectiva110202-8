#!/bin/bash

echo "=== Contenido de /home/site/wwwroot ==="
ls -la /home/site/wwwroot/

echo "=== Buscando carpetas con 'Proyecto' ==="
find /home/site/wwwroot -name "*Proyecto*" -type d

echo "=== Intentando navegar ==="

if [ -d "/home/site/wwwroot/Proyecto-Api-Restaurante/GestionRestaurante" ]; then
    cd /home/site/wwwroot/Proyecto-Api-Restaurante/GestionRestaurante
elif [ -d "/home/site/wwwroot/GestionRestaurante" ]; then
    cd /home/site/wwwroot/GestionRestaurante
else
    echo "No se encontró el directorio, usando ruta base"
    cd /home/site/wwwroot
fi

echo "=== Directorio actual ==="
pwd
ls -la

# Ejecutar Django
python manage.py migrate --noinput
python manage.py collectstatic --noinput
gunicorn GestionRestaurante.wsgi:application --bind 0.0.0.0:8000 --timeout 600