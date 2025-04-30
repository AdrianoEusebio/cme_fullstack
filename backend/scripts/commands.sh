#!/bin/sh

echo "🚀 Rodando comandos iniciais do Django..."

python manage.py collectstatic --noinput || exit 1
python manage.py makemigrations --noinput || exit 1
python manage.py migrate --noinput || exit 1

echo "🔐 Criando superusuário (caso não exista)..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("✔ Superusuário criado com sucesso!")
else:
    print("ℹ Superusuário já existe.")
EOF

echo "✅ Tudo pronto, iniciando o servidor!"
python manage.py runserver 0.0.0.0:8000
