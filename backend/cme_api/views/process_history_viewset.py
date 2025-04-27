from rest_framework import viewsets, filters
from cme_api.models import ProcessHistory
from cme_api.serializers import ProcessHistorySerializer
from rest_framework.permissions import IsAuthenticated

class ProcessHistoryViewSet(viewsets.ModelViewSet):
    queryset = ProcessHistory.objects.all()
    serializer_class = ProcessHistorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['produto_serial', 'etapa', 'user']
