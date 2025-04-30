#!/bin/sh

echo "🚀 Rodando comandos iniciais do Django..."

python manage.py collectstatic --no-input
python manage.py makemigrations --no-input
python manage.py migrate --no-input

echo "🔐 Criando superusuário (caso não exista)..."

# Este comando cria o superusuário via script inline
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