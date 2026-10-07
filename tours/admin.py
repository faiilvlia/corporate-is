from django.contrib import admin

from .models import Booking, Destination, Tour


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


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "author",
        "destination",
        "priority",
        "status",
        "assignee",
        "created_at",
    )
    list_filter = ("status", "priority", "destination")
    search_fields = ("title", "author", "description")
    list_select_related = ("destination", "assignee", "created_by")
