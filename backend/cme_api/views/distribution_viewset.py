from rest_framework import viewsets, filters
from cme_api.models import Distribution
from cme_api.serializers import DistributionSerializer
from rest_framework.permissions import IsAuthenticated
from cme_api.models import ProcessHistory
from cme_api.utils import registrar_etapa

class DistributionViewSet(viewsets.ModelViewSet):
    queryset = Distribution.objects.all()
    serializer_class = DistributionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['protudo_serial', 'user', 'sector']
    
    def perform_create(self, serializer):
        distribution = serializer.save(user=self.request.user)
        registrar_etapa(distribution.produto_serial, 
                        ProcessHistory.EtapaChoices.DISTRIBUTION, 
                        distribution.user, 
                        distribution)

