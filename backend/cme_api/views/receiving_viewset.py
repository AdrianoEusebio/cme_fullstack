from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from cme_api.utils import registrar_etapa
from cme_api.models import Receiving, ProcessHistory, ProductSerial
from cme_api.serializers import ReceivingSerializer



class ReceivingViewSet(viewsets.ModelViewSet):
    queryset = Receiving.objects.all()
    serializer_class = ReceivingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['produto_serial__codigo_serial', 'user__username']

    def create(self, request, *args, **kwargs):
        print("DEBUG RECEBIDO:", request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("ERROS:", serializer.errors)
            return Response(serializer.errors, status=400)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save(user=request.user)

        registrar_etapa(
            instance.produto_serial,
            ProcessHistory.EtapaChoices.RECEIVING,
            request.user,
            instance
        )
        return Response(self.get_serializer(instance).data, status=status.HTTP_201_CREATED)