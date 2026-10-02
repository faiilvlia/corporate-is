from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Кастомная модель пользователя для RoomMate RU.
    Расширяет стандартного пользователя Django полем телефона.
    Официальная рекомендация Django: всегда заводить свою модель пользователя
    в начале проекта, даже если она пока ничем не отличается от стандартной.
    """
    phone = models.CharField(
        "Телефон",
        max_length=20,
        blank=True,
        help_text="Контактный телефон пользователя"
    )

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

    def __str__(self):
        return self.username
