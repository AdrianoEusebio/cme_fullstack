from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from cme_api.models import ProductSerial
from cme_api.serializers import ProductSerialSerializer
from django.utils import timezone
from django.db.models import OuterRef, Subquery
from cme_api.models import ProcessHistory

class ProductSerialViewSet(viewsets.ModelViewSet):
    queryset = ProductSerial.objects.all()
    serializer_class = ProductSerialSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['codigo_serial']
    
    
    def get_queryset(self):
        queryset = super().get_queryset()
        status_param = self.request.query_params.get("status")

        if status_param:
            status_list = [s.strip() for s in status_param.split(",")]
            queryset = queryset.filter(status__in=status_list)

        return queryset