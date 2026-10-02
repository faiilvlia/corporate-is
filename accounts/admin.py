from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Добавляем наши поля в форму редактирования
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Контактные данные", {"fields": ("phone",)}),
    )
    # Добавляем phone в форму создания нового пользователя
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Контактные данные", {"fields": ("phone",)}),
    )
    list_display = ("username", "email", "first_name", "last_name", "phone", "is_staff")
