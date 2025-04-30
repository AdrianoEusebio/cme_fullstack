from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from cme_api.models import ProcessHistory
from cme_api.serializers import ProcessHistorySerializer
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter
from cme_api.serializers import ProcessHistoryCreateSerializer

class ProcessHistoryViewSet(viewsets.ModelViewSet):
    queryset = ProcessHistory.objects.all()
    serializer_class = ProcessHistorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['serial__codigo_serial', 'etapa', 'user__username']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProcessHistoryCreateSerializer
        return ProcessHistorySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("❌ ERROS NO SERIALIZER:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        instance = serializer.save(user=request.user)
        instance.serial.status = instance.etapa
        instance.serial.save()

        read_serializer = self.get_serializer(instance)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)
