from django.db import models


class Employee(models.Model):
    full_name = models.CharField(max_length=200, verbose_name="ФИО")
    position = models.CharField(max_length=100, verbose_name="Должность")
    hired_at = models.DateField(verbose_name="Дата приёма на работу")
    email = models.EmailField(blank=True, verbose_name="Email")
    is_active = models.BooleanField(default=True, verbose_name="Активный сотрудник")

    class Meta:
        verbose_name = "Сотрудник"
        verbose_name_plural = "Сотрудники"
        ordering = ["full_name"]

    def __str__(self):
        return self.full_name
