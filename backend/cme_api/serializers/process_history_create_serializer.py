from rest_framework import serializers
from cme_api.models import ProcessHistory, ProductSerial

class ProcessHistoryCreateSerializer(serializers.ModelSerializer):
    serial = serializers.PrimaryKeyRelatedField(queryset=ProductSerial.objects.all())
    
    class Meta:
        model = ProcessHistory
        fields = ['serial', 'etapa']
