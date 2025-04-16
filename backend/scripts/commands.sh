#!/bin/sh

echo "🚀 Rodando comandos iniciais do Django..."

python manage.py collectstatic --noinput
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "✅ Tudo pronto, iniciando o servidor!"
python manage.py runserver 0.0.0.0:8000