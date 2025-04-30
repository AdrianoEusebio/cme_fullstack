from rest_framework import serializers
from cme_api.models import Esterelization, ProductSerial

class EsterelizationSerializer(serializers.ModelSerializer):
    produto_serial = serializers.SlugRelatedField(
        queryset=ProductSerial.objects.all(),
        slug_field='codigo_serial'
    )

    class Meta:
        model = Esterelization
        fields = ['id', 'produto_serial', 'isEsterelization', 'entry_data']
        read_only_fields = ['user', 'entry_data']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
