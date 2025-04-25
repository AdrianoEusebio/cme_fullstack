from django.contrib import admin
from cme_api.models import (
    Receiving,
    Product,
    User,
    UserGroup,
    ProductSerial,
    Distribution,
    Washing,
    ProcessHistory,
    Category
) 

admin.site.register(Category)
admin.site.register(UserGroup)
admin.site.register(Product)
admin.site.register(ProductSerial)
admin.site.register(User)
admin.site.register(Receiving)
admin.site.register(Distribution)
admin.site.register(Washing)
admin.site.register(ProcessHistory )