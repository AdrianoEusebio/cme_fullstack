from rest_framework import serializers
from cme_api.models import Product, ProductSerial

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['id']

    def create(self, validated_data):
        product = Product.objects.create(**validated_data)
        prefix = product.get_codigo_prefixo
        codigo_serial = serializers.SerializerMethodField(read_only=True)
        last_serial = ProductSerial.objects.filter(
            codigo_serial__startswith=prefix
        ).order_by('-codigo_serial').first()
        if last_serial:
            try:
                last_number = int(last_serial.codigo_serial.replace(prefix, ''))
            except ValueError:
                last_number = 0
        else:
            last_number = 0
        new_number = last_number + 1
        codigo_serial = f"{prefix}{str(new_number).zfill(4)}"
        ProductSerial.objects.create(produto=product, codigo_serial=codigo_serial)
        return product
    
    def get_codigo_serial(self, obj):
        return obj.serials_products.first().codigo_serial if obj.serials_products.exists() else None
