from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from cme_api.models import Esterelization
from cme_api.serializers import EsterelizationSerializer

class EsterelizationViewSet(viewsets.ModelViewSet):
    queryset = Esterelization.objects.all()
    serializer_class = EsterelizationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['produto_serial__codigo_serial']

    def get_queryset(self):
        queryset = super().get_queryset()
        is_esterelization = self.request.query_params.get("isEsterelization")
        if is_esterelization == "false":
            queryset = queryset.filter(isEsterelization=False)
        return queryset

    def perform_create(self, serializer):
        esterelization = serializer.save()
        return esterelization
