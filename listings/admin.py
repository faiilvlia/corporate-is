from django.contrib import admin

from .models import City, Listing


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ("name", "region", "population", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "region")


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ("title", "room_type", "city", "price_per_month", "available_from", "is_active")
    list_filter = ("room_type", "is_active", "city")
    search_fields = ("title", "address", "description")
    ordering = ("-created_at",)
