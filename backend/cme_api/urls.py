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
from rest_framework_simplejwt.views import TokenRefreshView
from cme_api.views.token_viewset import CustomTokenObtainPairView
from cme_api.views.esterelization_viewset import EsterelizationViewSet
from cme_api.views.user_viewset import UserViewSet
from cme_api.views.group_viewset import GroupViewSet


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'products', ProductViewSet, basename='products')
router.register(r'product-serials', ProductSerialViewSet, basename='product-serials')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'washings', WashingViewSet, basename='washings')
router.register(r'receivings', ReceivingViewSet, basename='receivings')
router.register(r'distributions', DistributionViewSet, basename='distributions')
router.register(r'process-histories', ProcessHistoryViewSet, basename='process-histories')
router.register(r'esterelizations', EsterelizationViewSet, basename='esterelization')
router.register(r'groups', GroupViewSet)

urlpatterns = [
    path('v1/', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),	
]
