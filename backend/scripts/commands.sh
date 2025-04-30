#!/bin/sh

echo "🚀 Rodando comandos iniciais do Django..."

python manage.py collectstatic --noinput || exit 1
python manage.py makemigrations --noinput || exit 1
python manage.py migrate --noinput || exit 1

echo "🔐 Criando superusuário (caso não exista)..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

User = get_user_model()
username = 'admin'
email = 'admin@example.com'
password = 'admin123'

if not User.objects.filter(username=username).exists():
    user = User.objects.create_superuser(username, email, password)
    print("✔ Superusuário criado com sucesso!")

    group, _ = Group.objects.get_or_create(name='ADMIN')
    user.groups.add(group)
    print("✔ Superusuário adicionado ao grupo ADMIN.")
else:
    print("ℹ Superusuário já existe.")
EOF

echo "✅ Tudo pronto, iniciando o servidor!"
python manage.py runserver 0.0.0.0:8000
