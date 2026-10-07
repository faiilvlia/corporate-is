import logging

from rest_framework import viewsets

from .models import Destination, Tour
from .serializers import DestinationSerializer, TourSerializer

logger = logging.getLogger(__name__)


class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer


class TourViewSet(viewsets.ModelViewSet):
    # Оптимизация N+1 через select_related
    queryset = Tour.objects.select_related("destination").all()
    serializer_class = TourSerializer

    def perform_create(self, serializer):
        tour = serializer.save()
        logger.info(
            "Создан тур '%s' (id=%s), направление: %s, цена: %s, пользователь: %s",
            tour.title,
            tour.id,
            tour.destination,
            tour.price,
            self.request.user,
        )

    def perform_destroy(self, instance):
        logger.warning(
            "Удалён тур '%s' (id=%s), пользователь: %s",
            instance.title,
            instance.id,
            self.request.user,
        )
        instance.delete()
