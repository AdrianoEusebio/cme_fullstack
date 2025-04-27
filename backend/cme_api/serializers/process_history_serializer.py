from rest_framework import serializers
from cme_api.models import ProcessHistory

class ProcessHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessHistory
        fields = '__all__'
        read_only_fields = ['id', 'entry_data']