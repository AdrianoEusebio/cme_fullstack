from rest_framework import serializers
from cme_api.models import Esterelization, ProductSerial

class EsterelizationSerializer(serializers.ModelSerializer):
    produto_serial_id = serializers.IntegerField(source='produto_serial.id', read_only=True)
    produto_serial = serializers.SlugRelatedField(
        queryset=ProductSerial.objects.all(),
        slug_field='codigo_serial'
    )
    codigo_serial = serializers.CharField(source='produto_serial.codigo_serial', read_only=True)
    produto_nome = serializers.CharField(source='produto_serial.produto.nome', read_only=True)

    class Meta:
        model = Esterelization
        fields = [
            'id',
            'produto_serial',        
            'produto_serial_id',     
            'codigo_serial',
            'produto_nome',
            'isEsterelization',
            'entry_data'
        ]
        read_only_fields = ['id', 'entry_data']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
