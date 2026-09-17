from django.contrib import admin

from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ("full_name", "position", "hired_at", "email", "is_active")
    list_filter = ("is_active", "hired_at")
    search_fields = ("full_name", "position", "email")
    ordering = ("full_name",)
