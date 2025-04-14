from rest_framework.routers import DefaultRouter
from .views import ProdutoView

router = DefaultRouter()
router.register(r'produtos', ProdutoView, basename='produtos')

urlpatterns = router.urls