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
        fields = ['id', 'produto_serial', 'isWashed', 'entry_data']
        read_only_fields = ['user', 'entry_data']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)