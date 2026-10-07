import logging

from django.contrib import messages
from django.contrib.auth.decorators import login_required, permission_required
from django.core.exceptions import PermissionDenied
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST
from rest_framework import viewsets

from .forms import BookingForm, BookingProcessForm
from .models import Booking, Destination, Tour
from .serializers import DestinationSerializer, TourSerializer

logger = logging.getLogger(__name__)


# ==============================================================================
# REST API ViewSets (DRF)
# ==============================================================================

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer


class TourViewSet(viewsets.ModelViewSet):
    queryset = Tour.objects.select_related("destination").all()
    serializer_class = TourSerializer

    def perform_create(self, serializer):
        tour = serializer.save()
        logger.info(
            "Создан тур '%s' (id=%s), направление: %s, цена: %s, пользователь: %s",
            tour.title,
            tour.id,
            tour.destination,
            tour.price,
            self.request.user,
        )

    def perform_destroy(self, instance):
        logger.warning(
            "Удалён тур '%s' (id=%s), пользователь: %s",
            instance.title,
            instance.id,
            self.request.user,
        )
        instance.delete()


# ==============================================================================
# HTML Template Views (Лабы 0 и 0.1)
# ==============================================================================

def home(request):
    """Главная страница каталога экспедиций KRAI."""
    tours = Tour.objects.select_related("destination").filter(is_active=True)
    return render(request, "tours/home.html", {"tours": tours})


def tour_detail(request, pk):
    """Паспорт маршрута / детальная страница тура."""
    tour = get_object_or_404(Tour.objects.select_related("destination"), pk=pk)
    return render(request, "tours/tour_detail.html", {"tour": tour})


def visible_bookings(user):
    """
    Разграничение видимости экспедиционных заявок:
    Штаб/гиды видят все заявки, туристы — только свои собственные.
    """
    bookings = Booking.objects.select_related("destination", "tour", "created_by", "assignee")
    if user.has_perm("tours.change_booking"):
        return bookings
    return bookings.filter(created_by=user)


@login_required
def booking_list(request):
    """Штаб заявок с поиском Q(...) и фильтром по статусу."""
    bookings = visible_bookings(request.user).order_by("-created_at")
    status = request.GET.get("status", "")
    query = request.GET.get("q", "").strip()

    if status:
        bookings = bookings.filter(status=status)
    if query:
        bookings = bookings.filter(
            Q(title__icontains=query)
            | Q(author__icontains=query)
            | Q(description__icontains=query)
        )

    context = {
        "bookings": bookings,
        "statuses": Booking.Status.choices,
        "status": status,
        "query": query,
    }
    return render(request, "tours/booking_list.html", context)


@login_required
def booking_detail(request, pk):
    """Детальная информация о заявке с возможностью обработки гидом."""
    booking = get_object_or_404(visible_bookings(request.user), pk=pk)
    context = {
        "booking": booking,
        "can_edit": booking.can_be_edited_by(request.user),
    }
    if request.user.has_perm("tours.change_booking"):
        context["process_form"] = BookingProcessForm(instance=booking)

    return render(request, "tours/booking_detail.html", context)


@login_required
def booking_create(request):
    """Оформление экспедиционной заявки путешественником."""
    if request.method == "POST":
        form = BookingForm(request.POST)
        if form.is_valid():
            booking = form.save(commit=False)
            booking.created_by = request.user
            booking.save()
            messages.success(request, f"Заявка #{booking.pk} успешно зарегистрирована в штабе KRAI.")
            return redirect(booking)
    else:
        user = request.user
        initial = {"author": user.get_full_name() or user.username}
        tour_id = request.GET.get("tour")
        if tour_id:
            tour = Tour.objects.filter(pk=tour_id).first()
            if tour:
                initial["tour"] = tour
                initial["destination"] = tour.destination
                initial["title"] = f"Участие в экспедиции: {tour.title}"
        form = BookingForm(initial=initial)

    return render(
        request, "tours/booking_form.html", {"form": form, "page_title": "Подача заявки на экспедицию"}
    )


@login_required
def booking_update(request, pk):
    """Редактирование заявки (доступно только до взятия в работу)."""
    booking = get_object_or_404(visible_bookings(request.user), pk=pk)
    if not booking.can_be_edited_by(request.user):
        raise PermissionDenied

    if request.method == "POST":
        form = BookingForm(request.POST, instance=booking)
        if form.is_valid():
            form.save()
            messages.success(request, "Параметры экспедиционной заявки обновлены.")
            return redirect(booking)
    else:
        form = BookingForm(instance=booking)

    return render(
        request,
        "tours/booking_form.html",
        {"form": form, "page_title": f"Редактирование заявки #{booking.pk}"},
    )


@require_POST
@permission_required("tours.change_booking", raise_exception=True)
def booking_process(request, pk):
    """Обработка заявки штабом/гидом: смена статуса и назначение ответственного."""
    booking = get_object_or_404(Booking, pk=pk)
    form = BookingProcessForm(request.POST, instance=booking)
    if form.is_valid():
        form.save()
        messages.success(request, f"Заявка #{booking.pk} успешно обновлена.")
    else:
        messages.error(request, "Не удалось обновить заявку: проверьте корректность данных.")

    return redirect(booking)
