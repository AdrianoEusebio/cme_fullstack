from rest_framework import viewsets, filters
from cme_api.utils import registrar_etapa
from cme_api.models import Washing
from cme_api.serializers import WashingSerializer
from rest_framework.permissions import IsAuthenticated
from cme_api.models import ProcessHistory


class WashingViewSet(viewsets.ModelViewSet):
    queryset = Washing.objects.all()
    serializer_class = WashingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['produto_serial', 'status']
    
    def perform_create(self, serializer):
        washing = serializer.save()
        washing.isWashed = True
        washing.save()
        registrar_etapa(washing.produto_serial, ProcessHistory.EtapaChoices.WASHING, washing.user, washing)
      