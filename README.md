# RoomMate RU 🏠

Платформа для поиска соседей и совместной аренды жилья в России.  
Аналог [SpareRoom](https://www.spareroom.co.uk/) / [Roomies](https://www.roomies.com/) — первый подобный сервис на российском рынке.

## Почему переход на кастомного пользователя потребовал пересоздания базы (Lab 3)

Django использует `AUTH_USER_MODEL` для определения таблицы пользователей. Эта таблица создаётся
**первой**, и на неё ссылаются встроенные приложения `admin`, `auth` и `sessions` в своих миграциях.

Если база уже создана со стандартной `auth_user`, а потом добавить `AUTH_USER_MODEL = "accounts.User"`,
Django увидит противоречие: `admin.0001_initial` уже применён (он ссылается на `auth_user`),
а `accounts.0001_initial` ещё нет. Это приводит к ошибке `InconsistentMigrationHistory`.

**Вывод:** кастомную модель пользователя нужно заводить **в самом начале проекта**, до первого `migrate`.
В живом продакшене исправить это без потери данных крайне сложно. Для лабораторной базы данных
было выполнено пересоздание через `docker compose down -v` с повторным применением миграций.

## О проекте

Сервис позволяет арендодателям размещать объявления о свободных комнатах, а ищущим жильё — находить подходящих соседей по параметрам: город, цена, тип комнаты, дата заезда.

## Стек технологий

- **Backend:** Python 3.12 + Django 6.x + Django REST Framework + django-environ
- **База данных:** PostgreSQL 16 (запускается через Docker Compose)
- **Инфраструктура:** Docker Desktop + Docker Compose
- **Отладка:** django-debug-toolbar (в dev-режиме)
- **Frontend (планируется):** React

## Как запустить проект

### 1. Клонировать репозиторий

```bash
git clone https://github.com/faiilvlia/corporate-is.git
cd corporate-is
```

### 2. Создать виртуальное окружение и установить зависимости

```bash
# Windows:
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
```

### 3. Создать файл `.env`

```bash
copy .env.example .env
```

Пример содержимого `.env`:
```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgres://corporate_is:corporate_is_password@localhost:5432/corporate_is
ALLOWED_HOSTS=localhost,127.0.0.1
DB_CONN_MAX_AGE=60
LOG_LEVEL=INFO
```

### 4. Запустить PostgreSQL через Docker Compose

```bash
docker compose up -d
docker compose ps
```

### 5. Применить миграции и создать суперпользователя

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 6. Запустить сервер разработки

```bash
python manage.py runserver
```

Открыть в браузере:
- **Главная:** http://127.0.0.1:8000/
- **Admin Panel:** http://127.0.0.1:8000/admin/
- **API:** http://127.0.0.1:8000/api/

---

## Структура проекта

```text
corporate-is/
├── accounts/            # Кастомная модель пользователя User(AbstractUser) с полем phone
├── config/              # Пакет конфигурации проекта
│   ├── settings/        # Раздельные настройки по 12-factor app
│   │   ├── base.py      # Общие настройки, django-environ, LOGGING
│   │   ├── dev.py       # DEBUG=True, django-debug-toolbar
│   │   └── prod.py      # DEBUG=False, security-заголовки, HSTS, SSL
│   ├── asgi.py
│   ├── urls.py          # Маршруты + debug_toolbar_urls в dev
│   └── wsgi.py
├── listings/            # Объявления и города (модели, сериализаторы, ViewSets)
├── docker-compose.yml   # PostgreSQL контейнер
├── .env.example         # Шаблон переменных окружения
├── requirements.txt     # Зависимости Python
└── manage.py            # По умолчанию использует config.settings.dev
```

---

## Модели данных

### `User` (`accounts.models.User`)
Кастомный пользователь на базе `AbstractUser`.
- `phone`: контактный номер телефона пользователя.
- Стандартные поля: `username`, `email`, `first_name`, `last_name`, `password`, `is_staff` и др.

### `City` (`listings.models.City`)
- `name`: название города.
- `region`: область/регион.
- `population`: численность населения.
- `is_active`: флаг доступности города в сервисе.

### `Listing` (`listings.models.Listing`)
- `title`: заголовок объявления.
- `room_type`: тип (отдельная комната / совместная / студия).
- `city`: ForeignKey на модель `City` (с `on_delete=models.PROTECT`).
- `address`: адрес.
- `price_per_month`: стоимость в месяц (₽).
- `available_from`: дата заезда.
- `description`: подробное описание.
- `is_active`: статус активности.
- `created_at`: дата создания.

---

## REST API (Lab 2)

Browsable API DRF доступен по адресу: http://127.0.0.1:8000/api/

| Эндпоинт | Методы | Описание |
|---|---|---|
| `/api/` | GET | Корень API — список ресурсов |
| `/api/cities/` | GET, POST | Список городов / создание города |
| `/api/cities/<id>/` | GET, PATCH, DELETE | Просмотр, обновление, удаление города |
| `/api/listings/` | GET, POST | Список объявлений / создание объявления |
| `/api/listings/<id>/` | GET, PATCH, DELETE | Просмотр, обновление, удаление объявления |

---

## Логирование (Lab 3)

В `config/settings/base.py` сконфигурирован словарь `LOGGING`:
- Вывод структурированных логов в консоль (`logging.StreamHandler`) в stdout — стандарт для Docker/контейнеров.
- Уровень логирования настраивается через переменную окружения `LOG_LEVEL` (по умолчанию `INFO`).
- В `listings/views.py`:
  - `perform_create`: логирует событие создания объявления на уровне `INFO`.
  - `perform_destroy`: логирует событие удаления объявления на уровне `WARNING`.

---

## Отладка SQL и устранение проблемы N+1 (Lab 3)

В сериализаторе `ListingSerializer` используется вычисляемое поле:
```python
city_name = serializers.CharField(source="city.name", read_only=True)
```

При выборке списка объявлений без оптимизации (`Listing.objects.all()`):
- На каждое объявление ORM выполняет отдельный SQL-запрос к таблице `listings_city` для получения названия города.
- **Число SQL-запросов ДО оптимизации (N+1):** **11 запросов** на 10 записей (1 запрос на список объявлений + 10 повторяющихся запросов за городами).

После оптимизации с использованием `select_related("city")`:
```python
queryset = Listing.objects.select_related("city").all()
```
- Django ORM формирует один SQL-запрос с `JOIN` таблиц `listings_listing` и `listings_city`.
- **Число SQL-запросов ПОСЛЕ оптимизации:** **1 запрос**.

В браузере при обращении к `/api/listings/` в dev-режиме панель **Django Debug Toolbar** наглядно показывает вкладку SQL с сокращением запросов и отсутствием дубликатов.
