from rest_framework import viewsets, filters
from cme_api.models import Washing
from cme_api.serializers import WashingSerializer
from rest_framework.permissions import IsAuthenticated
from cme_api.models import ProcessHistory
from django.utils import timezone

class WashingViewSet(viewsets.ModelViewSet):
    queryset = Washing.objects.all()
    serializer_class = WashingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['produto_serial', 'status']
    
    def perform_create(self, serializer):
        washing = serializer.save()
        ProcessHistory.objects.create(
            serial=washing.produto_serial,
            etapa=ProcessHistory.EtapaChoices.WASHING,
            user = washing.user,
            entry_data = timezone.now(),
            receiving = None,
            distribution = None,
            washing = washing
        )
      