from cme_api.models import ProductSerial

class ProductSerialService:
    @staticmethod
    def create(produto):
        ProductSerial.objects.create(produto=produto)