from rest_framework import serializers
from cme_api.models import Distribution, ProductSerial

class DistributionSerializer(serializers.ModelSerializer):
    produto_serial = serializers.SlugRelatedField(
        queryset=ProductSerial.objects.all(),
        slug_field='codigo_serial'
    )
    codigo_serial = serializers.CharField(source='produto_serial.codigo_serial', read_only=True)
    produto_nome = serializers.CharField(source='produto_serial.produto.nome', read_only=True)
    user = serializers.StringRelatedField()

    class Meta:
        model = Distribution
        fields = [
            'id',
            'produto_serial',
            'codigo_serial',
            'produto_nome',
            'sector',
            'entry_data',
            'user'
        ]
        read_only_fields = ['id', 'entry_data']
