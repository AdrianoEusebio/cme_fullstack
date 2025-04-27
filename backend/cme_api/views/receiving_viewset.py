from rest_framework import viewsets, filters
from cme_api.models import Receiving
from cme_api.serializers import ReceivingSerializer
from rest_framework.permissions import IsAuthenticated
from cme_api.models import ProcessHistory
from django.utils import timezone

class ReceivingViewSet(viewsets.ModelViewSet):
    queryset = Receiving.objects.all()
    serializer_class = ReceivingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['produto_serial', 'user']
    
    def perform_create(self, serializer):
        receiving = serializer.save()
        
        ProcessHistory.objects.create(
            serial = receiving.produto_serial,
            etapa = ProcessHistory.EtapaChoices.RECEIVING,
            user = receiving.user,
            entry_data = timezone.now(),
            receiving = receiving,
            distribution = None,
            washing = None
        )
