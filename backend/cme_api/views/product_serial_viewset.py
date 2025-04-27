from rest_framework import viewsets
from cme_api.models import ProductSerial
from cme_api.serializers import ProductSerialSerializer
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated

class ProductSerialViewSet(viewsets.ModelViewSet):

    queryset = ProductSerial.objects.all()
    serializer_class = ProductSerialSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['codigo_serial']