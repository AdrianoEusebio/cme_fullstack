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
    

    @action(detail=False, methods=["get"], url_path="seriais-validos")
    def seriais_validos(self, request):
        todos_seriais = ProductSerial.objects.all()
        seriais_validos = []
        for serial in todos_seriais:
            ultimo_processo = serial.entry_process_history.order_by('-entry_data').first()
            if not ultimo_processo:
                seriais_validos.append((serial, timezone.now()))
            elif ultimo_processo.etapa == "DISTRIBUTION":
                seriais_validos.append((serial, ultimo_processo.entry_data))
        seriais_ordenados = sorted(
            seriais_validos,
            key=lambda x: x[1],
            reverse=True
        )
        data = [
            {
                "id": serial.id,
                "codigo_serial": serial.codigo_serial,
                "produto_nome": serial.produto.nome if serial.produto else "",
            }
            for serial, _ in seriais_ordenados
        ]
        return Response(data, status=status.HTTP_200_OK)
    
    
    @action(detail=False, methods=["get"], url_path="seriais-validos-washing")
    def seriais_validos_washing(self, request):

        todos_seriais = ProductSerial.objects.all()
        seriais_validos = []

        for serial in todos_seriais:
            ultimo_processo = serial.entry_process_history.order_by('-entry_data').first()
            if ultimo_processo and ultimo_processo.etapa == "RECEIVING":
                seriais_validos.append((serial, ultimo_processo.entry_data))
                
        seriais_ordenados = sorted(
            seriais_validos,
            key=lambda x: x[1],
            reverse=True
        )
        data = [
            {
                "id": serial.id,
                "codigo_serial": serial.codigo_serial,
                "produto_nome": serial.produto.nome if serial.produto else "",
            }
            for serial, _ in seriais_ordenados
        ]
        return Response(data, status=status.HTTP_200_OK)
    
    
    @action(detail=False, methods=["get"], url_path="seriais-validos-distribution")
    def seriais_validos_distribution(self, request):
        subquery = ProcessHistory.objects.filter(
            serial=OuterRef('pk')
        ).order_by('-entry_data').values('etapa')[:1]
        seriais = ProductSerial.objects.annotate(
            ultima_etapa=Subquery(subquery)
        ).filter(
            ultima_etapa__in=[
                ProcessHistory.EtapaChoices.RECEIVING,
                ProcessHistory.EtapaChoices.WASHING_COMPLETED,
            ]
        )
        data = [
            {
                "id": s.id,
                "codigo_serial": s.codigo_serial,
                "produto_nome": s.produto.nome if s.produto else "",
            }
            for s in seriais
        ]
        return Response(data, status=status.HTTP_200_OK)


    @action(detail=False, methods=["get"], url_path="seriais-washing-complete")
    def seriais_washing_complete(self, request):
        seriais_ids = (
            ProcessHistory.objects.filter(etapa="WASHING COMPLETE")
            .values_list("serial", flat=True)
        )
        seriais = ProductSerial.objects.filter(id__in=seriais_ids).order_by("-criado_em")
        serializer = ProductSerialSerializer(seriais, many=True)
        return Response(serializer.data)