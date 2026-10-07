from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.test import TestCase
from django.urls import reverse

from .models import Booking, Destination, Tour

User = get_user_model()


class BookingAccessTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Пользователи
        cls.traveler = User.objects.create_user("ivanov", password="test-pass-123")
        cls.colleague = User.objects.create_user("sidorov", password="test-pass-123")
        cls.guide = User.objects.create_user("petrov", password="test-pass-123")

        # Группа штаба
        staff_group = Group.objects.create(name="Штаб экспедиций")
        staff_group.permissions.add(
            Permission.objects.get(codename="change_booking"),
            Permission.objects.get(codename="view_booking"),
        )
        cls.guide.groups.add(staff_group)

        # Направление
        cls.altay = Destination.objects.create(name="Горный Алтай", is_active=True)

        # Своя и чужая заявки
        cls.own_booking = Booking.objects.create(
            title="Восхождение на Белуху",
            author="Иван Иванов",
            destination=cls.altay,
            created_by=cls.traveler,
        )
        cls.foreign_booking = Booking.objects.create(
            title="Ледовый поход по Байкалу",
            author="Сидоров",
            destination=cls.altay,
            created_by=cls.colleague,
        )

    def test_anonymous_is_redirected_to_login(self):
        """1. Анонимный пользователь перенаправляется на экран входа."""
        url = reverse("booking_list")
        response = self.client.get(url)
        self.assertRedirects(response, f"{reverse('login')}?next={url}")

    def test_employee_sees_only_own_bookings(self):
        """2. Турист видит в списке только свои собственные заявки."""
        self.client.force_login(self.traveler)
        response = self.client.get(reverse("booking_list"))
        self.assertContains(response, self.own_booking.title)
        self.assertNotContains(response, self.foreign_booking.title)

    def test_employee_cannot_open_foreign_booking(self):
        """3. Попытка открыть чужую заявку возвращает 404."""
        self.client.force_login(self.traveler)
        response = self.client.get(self.foreign_booking.get_absolute_url())
        self.assertEqual(response.status_code, 404)

    def test_created_booking_belongs_to_current_user(self):
        """4. Созданная заявка автоматически привязывается к автору запроса."""
        self.client.force_login(self.traveler)
        response = self.client.post(
            reverse("booking_create"),
            {
                "title": "Сплав по Катуни 5 дней",
                "author": "Иван Иванов",
                "destination": self.altay.pk,
                "priority": "normal",
            },
        )
        booking = Booking.objects.get(title="Сплав по Катуни 5 дней")
        self.assertEqual(booking.created_by, self.traveler)
        self.assertRedirects(response, booking.get_absolute_url())

    def test_short_title_is_rejected(self):
        """5. Серверная валидация clean_title отклоняет тему короче 5 символов."""
        self.client.force_login(self.traveler)
        response = self.client.post(
            reverse("booking_create"),
            {
                "title": "тур",
                "author": "Иван Иванов",
                "destination": self.altay.pk,
                "priority": "normal",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "хотя бы в 5 символов")
        self.assertFalse(Booking.objects.filter(title="тур").exists())

    def test_employee_cannot_process_booking(self):
        """6. Обычный турист не имеет прав на смену статуса и назначение гида (403)."""
        self.client.force_login(self.traveler)
        response = self.client.post(
            reverse("booking_process", args=[self.own_booking.pk]),
            {"status": "confirmed"},
        )
        self.assertEqual(response.status_code, 403)

    def test_staff_can_process_booking(self):
        """7. Гид из штаба экспедиций может назначить себя и перевести статус в 'В работе'."""
        self.client.force_login(self.guide)
        response = self.client.post(
            reverse("booking_process", args=[self.foreign_booking.pk]),
            {"status": "in_progress", "assignee": self.guide.pk},
        )
        self.foreign_booking.refresh_from_db()
        self.assertEqual(self.foreign_booking.status, Booking.Status.IN_PROGRESS)
        self.assertEqual(self.foreign_booking.assignee, self.guide)
        self.assertRedirects(response, self.foreign_booking.get_absolute_url())
