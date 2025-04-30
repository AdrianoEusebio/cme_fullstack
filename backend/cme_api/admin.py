from django.contrib import admin
from cme_api.models import (
    Receiving,
    Product,
    ProductSerial,
    Distribution,
    Washing,
    ProcessHistory,
    Category,
    Esterelization,
) 

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ProductSerial)
admin.site.register(Receiving)
admin.site.register(Distribution)
admin.site.register(Washing)
admin.site.register(ProcessHistory )
admin.site.register(Esterelization)