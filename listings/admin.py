from django.contrib import admin

from .models import Listing


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ("title", "room_type", "city", "price_per_month", "available_from", "is_active")
    list_filter = ("room_type", "is_active", "city")
    search_fields = ("title", "city", "address", "description")
    ordering = ("-created_at",)
