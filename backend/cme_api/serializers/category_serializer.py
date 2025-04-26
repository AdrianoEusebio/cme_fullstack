from rest_framework import serializers
from cme_api.models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'type', 'descricao']
        read_only_fields = ['id']
