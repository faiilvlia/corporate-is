from rest_framework import viewsets

from .models import City, Listing
from .serializers import CitySerializer, ListingSerializer


class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.select_related("city").all()
    serializer_class = ListingSerializer
