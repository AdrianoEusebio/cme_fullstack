from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from cme_api.models import Receiving, ProcessHistory, ProductSerial
from cme_api.serializers import ReceivingSerializer

class ReceivingViewSet(viewsets.ModelViewSet):
    queryset = Receiving.objects.all()
    serializer_class = ReceivingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['produto_serial__codigo_serial', 'user__username']

    def create(self, request, *args, **kwargs):
        serial_id = request.data.get("serial")
        if not serial_id:
            return Response({"detail": "Campo serial obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            serial = ProductSerial.objects.get(pk=serial_id)
        except ProductSerial.DoesNotExist:
            return Response({"detail": "Serial não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        receiving = Receiving.objects.create(
            produto_serial=serial,
            user=request.user
        )
        ProcessHistory.objects.create(
            serial=serial,
            etapa=ProcessHistory.EtapaChoices.RECEIVING,
            user=request.user,
            receiving=receiving
        )

        return Response({"detail": "Receiving e ProcessHistory criados com sucesso."}, status=status.HTTP_201_CREATED)
