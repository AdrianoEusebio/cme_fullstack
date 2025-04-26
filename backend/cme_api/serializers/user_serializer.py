from rest_framework import serializers
from cme_api.models import User
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model:User
        fields = ['id','username', 'email', 'hash', 'user_group','created_at']
        read_only_fields = ['id', 'created_at']
        
    def create(self, validated_data):
        validated_data['hash'] = make_password(validated_data['hash'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'hash' in validated_data:
            validated_data['hash'] = make_password(validated_data['hash'])
        return super().update(instance, validated_data)

