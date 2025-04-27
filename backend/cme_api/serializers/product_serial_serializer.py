from rest_framework import serializers
from cme_api.models import ProductSerial

class ProductSerialSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSerial
        fields = '__all__'
        read_only_fields = ['id','codigo_serial','criado_em']