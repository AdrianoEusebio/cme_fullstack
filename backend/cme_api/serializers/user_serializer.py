from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.models import Group

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    group = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'password', 'group']
        read_only_fields = ['id', 'is_active']

    def create(self, validated_data):
        group_name = validated_data.pop("group", None)
        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        if group_name:
            try:
                group = Group.objects.get(name=group_name.upper())
                user.groups.add(group)
            except Group.DoesNotExist:
                raise serializers.ValidationError({"group": "Grupo inválido."})

        return user
