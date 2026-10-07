from rest_framework import serializers

from .models import Destination, Tour


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ["id", "name", "region", "description", "is_active"]


class TourSerializer(serializers.ModelSerializer):
    # Название направления в ответе (read-only)
    destination_name = serializers.CharField(source="destination.name", read_only=True)

    class Meta:
        model = Tour
        fields = [
            "id",
            "title",
            "tour_type",
            "destination",
            "destination_name",
            "price",
            "duration_days",
            "start_date",
            "max_group_size",
            "description",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["created_at"]
