from rest_framework import viewsets
from cme_api.models import Category
from cme_api.serializers import CategorySerializer
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['type', 'descricao']