from rest_framework.routers import DefaultRouter

from .views import DestinationViewSet, TourViewSet

router = DefaultRouter()
router.register("destinations", DestinationViewSet)
router.register("tours", TourViewSet)

urlpatterns = router.urls
