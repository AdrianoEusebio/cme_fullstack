from rest_framework import serializers
from cme_api.models import Washing
from cme_api.models import ProductSerial

class WashingSerializer(serializers.ModelSerializer):
    
    produto_serial = serializers.SlugRelatedField(
        queryset=ProductSerial.objects.all(),
        slug_field='codigo_serial'
    )

    class Meta:
        model = Washing
        fields = '__all__'
        read_only_fields = ['id', 'entry_data', 'status']

    def create(self, validated_data):
        return Washing.objects.create(**validated_data)