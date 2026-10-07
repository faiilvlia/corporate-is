from django import forms
from django.contrib.auth import get_user_model

from .models import Booking


class StyleFormMixin:
    """Примесь для стилизации полей форм под дизайн-систему KRAI."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            if isinstance(field.widget, forms.Select):
                field.widget.attrs["class"] = "krai-select"
            elif isinstance(field.widget, forms.Textarea):
                field.widget.attrs["class"] = "krai-textarea"
            else:
                field.widget.attrs["class"] = "krai-input"


class BookingForm(StyleFormMixin, forms.ModelForm):
    """Форма создания и редактирования экспедиционной заявки."""

    class Meta:
        model = Booking
        fields = ["title", "author", "destination", "tour", "priority", "description"]
        widgets = {
            "description": forms.Textarea(
                attrs={
                    "rows": 4,
                    "placeholder": "Укажите ваш опыт походов, наличие снаряжения и пожелания к маршруту...",
                }
            ),
        }
        help_texts = {
            "author": "ФИО основного участника или руководителя группы",
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if "destination" in self.fields:
            self.fields["destination"].empty_label = "— выберите направление —"
        if "tour" in self.fields:
            self.fields["tour"].empty_label = "— выберите тур (опционально) —"

    def clean_title(self):
        title = self.cleaned_data["title"].strip()
        if len(title) < 5:
            raise forms.ValidationError("Сформулируйте тему маршрута хотя бы в 5 символов.")
        return title


class BookingProcessForm(StyleFormMixin, forms.ModelForm):
    """Форма штаба экспедиций: статус и назначение куратора/гида."""

    class Meta:
        model = Booking
        fields = ["status", "assignee"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        user_model = get_user_model()
        assignee = self.fields["assignee"]
        assignee.queryset = user_model.objects.filter(groups__name="Штаб экспедиций")
        assignee.empty_label = "— куратор не назначен —"
