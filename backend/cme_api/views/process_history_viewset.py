from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from cme_api.models import ProcessHistory
from cme_api.serializers import ProcessHistorySerializer
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter

class ProcessHistoryViewSet(viewsets.ModelViewSet):
    queryset = ProcessHistory.objects.all()
    serializer_class = ProcessHistorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['serial__codigo_serial', 'etapa', 'user__username']
    
    @extend_schema(
        parameters=[
            OpenApiParameter(name="serial", description="Código serial do produto", required=True, type=str),
        ]
    )
    @action(detail=False, methods=['get'], url_path='traceability')
    def traceability(self, request):
        serial = request.query_params.get('serial')

        if not serial:
            return Response(
                {"detail": "É necessário informar o parâmetro 'serial'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        queryset = self.queryset.filter(serial__codigo_serial=serial).order_by('entry_data')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
