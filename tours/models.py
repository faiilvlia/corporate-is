from django.db import models


class Destination(models.Model):
    """Туристическое направление или регион (например: Алтай, Байкал, Дагестан)."""

    name = models.CharField(max_length=120, unique=True, verbose_name="Направление")
    region = models.CharField(max_length=150, blank=True, verbose_name="Регион / Страна")
    description = models.TextField(blank=True, verbose_name="Описание направления")
    is_active = models.BooleanField(default=True, verbose_name="Активно")

    class Meta:
        verbose_name = "Направление"
        verbose_name_plural = "Направления"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Tour(models.Model):
    """Тур или авторское путешествие."""

    TOUR_TYPE_CHOICES = [
        ("trekking", "Треккинг и походы"),
        ("jeep", "Джип-тур"),
        ("sightseeing", "Экскурсионный тур"),
        ("rafting", "Сплав и водный тур"),
        ("photo", "Фототур"),
    ]

    title = models.CharField(max_length=200, verbose_name="Название тура")
    tour_type = models.CharField(
        max_length=30,
        choices=TOUR_TYPE_CHOICES,
        default="sightseeing",
        verbose_name="Тип тура",
    )
    destination = models.ForeignKey(
        Destination,
        on_delete=models.PROTECT,
        related_name="tours",
        verbose_name="Направление",
    )
    price = models.DecimalField(
        max_digits=10, decimal_places=2, verbose_name="Стоимость тура (₽)"
    )
    duration_days = models.PositiveIntegerField(
        default=3, verbose_name="Длительность (дней)"
    )
    start_date = models.DateField(verbose_name="Дата начала")
    max_group_size = models.PositiveIntegerField(
        default=10, verbose_name="Макс. участников в группе"
    )
    description = models.TextField(blank=True, verbose_name="Программа тура")
    is_active = models.BooleanField(default=True, verbose_name="Активен")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        verbose_name = "Тур"
        verbose_name_plural = "Туры"
        ordering = ["-created_at"]

    def __str__(self):
        dest_name = self.destination.name if self.destination else "—"
        return f"{self.title} — {dest_name} ({self.price} ₽)"
