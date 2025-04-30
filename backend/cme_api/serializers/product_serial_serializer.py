from rest_framework import serializers
from cme_api.models import ProductSerial

class ProductSerialSerializer(serializers.ModelSerializer):
    produto_nome = serializers.SerializerMethodField()

    class Meta:
        model = ProductSerial
        fields = ['id', 'codigo_serial', 'produto_nome']

    def get_produto_nome(self, obj):
        return obj.produto.nome if obj.produto else None