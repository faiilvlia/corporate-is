from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

# DRF API Router
api_router = DefaultRouter()
api_router.register("destinations", views.DestinationViewSet)
api_router.register("tours", views.TourViewSet)

urlpatterns = [
    # HTML Views
    path("", views.home, name="home"),
    path("tours/<int:pk>/", views.tour_detail, name="tour_detail"),
    path("bookings/", views.booking_list, name="booking_list"),
    path("bookings/new/", views.booking_create, name="booking_create"),
    path("bookings/<int:pk>/", views.booking_detail, name="booking_detail"),
    path("bookings/<int:pk>/edit/", views.booking_update, name="booking_update"),
    path("bookings/<int:pk>/process/", views.booking_process, name="booking_process"),
    
    # REST API endpoints
    path("api/", include(api_router.urls)),
]
