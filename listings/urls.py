from rest_framework.routers import DefaultRouter

from .views import CityViewSet, ListingViewSet

router = DefaultRouter()
router.register("cities", CityViewSet)
router.register("listings", ListingViewSet)

urlpatterns = router.urls
