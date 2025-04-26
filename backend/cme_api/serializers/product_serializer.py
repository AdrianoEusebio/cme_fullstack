from rest_framework import serializers
from cme_api.models import Product
from service.product_serial_service import ProductSerialService

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'category']
        read_only_fields = ['id']
        
    def create(self, validated_data):
        product = super().create(validated_data)
        ProductSerialService.create(produto=product)
        return super().create(validated_data)