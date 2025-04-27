from rest_framework import serializers
from cme_api.models import Receiving
from cme_api.models import ProductSerial


class ReceivingSerializer(serializers.ModelSerializer):
    
    produto_serial = serializers.SlugRelatedField(
        queryset=ProductSerial.objects.all(),
        slug_field='codigo_serial'
    )
    
    class Meta:
        model = Receiving
        fields = '__all__'
        read_only_fields = ['id', 'entry_data']