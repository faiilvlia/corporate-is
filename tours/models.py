from django.conf import settings
from django.db import models
from django.urls import reverse


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

    def get_absolute_url(self):
        return reverse("tour_detail", args=[self.pk])


class Booking(models.Model):
    """Экспедиционная заявка / бронирование путешествия."""

    class Status(models.TextChoices):
        NEW = "new", "Новая"
        IN_PROGRESS = "in_progress", "В работе"
        CONFIRMED = "confirmed", "Подтверждена"
        CANCELLED = "cancelled", "Отменена"

    class Priority(models.TextChoices):
        LOW = "low", "Низкий"
        NORMAL = "normal", "Обычный"
        HIGH = "high", "Высокий (срочный выезд)"

    title = models.CharField("Тема / Маршрут", max_length=200)
    author = models.CharField("Путешественник", max_length=100)
    description = models.TextField("Опыт походов и пожелания", blank=True)
    destination = models.ForeignKey(
        Destination,
        verbose_name="Направление",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="bookings",
    )
    tour = models.ForeignKey(
        Tour,
        verbose_name="Тур",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bookings",
    )
    priority = models.CharField(
        "Приоритет", max_length=20, choices=Priority.choices, default=Priority.NORMAL
    )
    status = models.CharField(
        "Статус", max_length=20, choices=Status.choices, default=Status.NEW
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Зарегистрировал",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_bookings",
    )
    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Куратор / Старший гид",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_bookings",
    )
    created_at = models.DateTimeField("Создана", auto_now_add=True)
    updated_at = models.DateTimeField("Изменена", auto_now=True)

    class Meta:
        verbose_name = "Заявка на экспедицию"
        verbose_name_plural = "Заявки на экспедиции"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Заявка #{self.pk}: {self.title}"

    def get_absolute_url(self):
        return reverse("booking_detail", args=[self.pk])

    def can_be_edited_by(self, user):
        """Штаб/гиды правят любые заявки, путешественник — только свои и только новые."""
        if user.has_perm("tours.change_booking"):
            return True
        return self.created_by == user and self.status == self.Status.NEW
