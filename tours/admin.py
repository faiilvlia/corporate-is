from django.contrib import admin

from .models import Destination, Tour


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ("name", "region", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "region")


@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "destination",
        "tour_type",
        "price",
        "duration_days",
        "start_date",
        "is_active",
    )
    list_filter = ("tour_type", "destination", "is_active")
    search_fields = ("title", "description")
    ordering = ("-created_at",)
