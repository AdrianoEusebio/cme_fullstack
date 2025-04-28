from rest_framework import serializers
from cme_api.models import ProcessHistory

class ProcessHistorySerializer(serializers.ModelSerializer):
    serialMaterial = serializers.CharField(source='serial.codigo_serial', read_only=True)
    idUser = serializers.CharField(source='user.username', read_only=True)
    enumStatus = serializers.CharField(source='etapa', read_only=True)
    entryData = serializers.DateTimeField(source='entry_data', read_only=True)
    class Meta:
        model = ProcessHistory
        fields = ['id', 'serialMaterial', 'idUser', 'enumStatus', 'entryData']