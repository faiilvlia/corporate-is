from django.db import models


class Listing(models.Model):
    """Объявление о сдаче комнаты / поиске соседа."""

    ROOM_TYPE_CHOICES = [
        ("private", "Отдельная комната"),
        ("shared", "Совместная комната"),
        ("studio", "Студия целиком"),
    ]

    title = models.CharField(max_length=200, verbose_name="Заголовок")
    room_type = models.CharField(
        max_length=20,
        choices=ROOM_TYPE_CHOICES,
        default="private",
        verbose_name="Тип жилья",
    )
    city = models.CharField(max_length=100, verbose_name="Город")
    address = models.CharField(max_length=300, verbose_name="Адрес")
    price_per_month = models.DecimalField(
        max_digits=10, decimal_places=2, verbose_name="Цена в месяц (₽)"
    )
    available_from = models.DateField(verbose_name="Доступно с")
    description = models.TextField(blank=True, verbose_name="Описание")
    is_active = models.BooleanField(default=True, verbose_name="Активно")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        verbose_name = "Объявление"
        verbose_name_plural = "Объявления"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} — {self.city} ({self.price_per_month} ₽/мес)"
