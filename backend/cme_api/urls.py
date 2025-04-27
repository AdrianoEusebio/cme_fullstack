from os import path
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from cme_api.views.product_viewset import ProductViewSet
from cme_api.views.product_serial_viewset import ProductSerialViewSet
from cme_api.views.category_viewset import CategoryViewSet
from cme_api.views.washing_viewset import WashingViewSet
from cme_api.views.receiving_viewset import ReceivingViewSet
from cme_api.views.distribution_viewset import DistributionViewSet
from cme_api.views.process_history_viewset import ProcessHistoryViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'product-serials', ProductSerialViewSet, basename='product-serials')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'washings', WashingViewSet, basename='washings')
router.register(r'receivings', ReceivingViewSet, basename='receivings')
router.register(r'distributions', DistributionViewSet, basename='distributions')
router.register(r'process-histories', ProcessHistoryViewSet, basename='process-histories')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),	
]
