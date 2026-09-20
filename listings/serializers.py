from rest_framework import serializers

from .models import City, Listing


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ["id", "name", "region", "population", "is_active"]


class ListingSerializer(serializers.ModelSerializer):
    # Показываем название города в ответе (read-only)
    city_name = serializers.CharField(source="city.name", read_only=True)

    class Meta:
        model = Listing
        fields = [
            "id",
            "title",
            "room_type",
            "city",
            "city_name",
            "address",
            "price_per_month",
            "available_from",
            "description",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["created_at"]
