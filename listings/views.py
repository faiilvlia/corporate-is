import logging

from rest_framework import viewsets

from .models import City, Listing
from .serializers import CitySerializer, ListingSerializer

logger = logging.getLogger(__name__)


class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.select_related("city").all()
    serializer_class = ListingSerializer

    def perform_create(self, serializer):
        listing = serializer.save()
        logger.info(
            "Создано объявление '%s' (id=%s), город: %s, цена: %s, пользователь: %s",
            listing.title,
            listing.id,
            listing.city,
            listing.price_per_month,
            self.request.user,
        )

    def perform_destroy(self, instance):
        logger.warning(
            "Удалено объявление '%s' (id=%s), пользователь: %s",
            instance.title,
            instance.id,
            self.request.user,
        )
        instance.delete()
