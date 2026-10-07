# TourHub RU 🏔️

Платформа для поиска и бронирования авторских туров, джип-экспедиций и походов по России  
(Горный Алтай, Байкал, Дагестан, Камчатка, Карелия).

---

## Архитектурный рефакторинг и смена доменной области (Pivot)

В рамках развития проекта был проведён рефакторинг доменной области (pivot):
1. **Сохранение фундаментальной архитектуры:**
   * Контейнеризация СУБД PostgreSQL 16 через **Docker Compose**.
   * Разделение конфигураций по методологии *12-factor app* (`config/settings/base.py`, `dev.py`, `prod.py`) с использованием `django-environ`.
   * Кастомная модель пользователя `accounts.User(AbstractUser)` с контактным телефоном (для гидов и организаторов туров).
   * Структурированное логирование действий (`perform_create`, `perform_destroy`) в `stdout`.
   * Инструменты профилирования и отладки (**Django Debug Toolbar**) в `dev`-окружении.
   * Оптимизация проблемы N+1 запросов с помощью `select_related`.
2. **Перепрофилирование бизнес-логики:**
   * Создано доменное приложение `tours` с моделями туристических направлений (`Destination`) и туров (`Tour`).
   * Полноценный REST API на **Django REST Framework** (`/api/destinations/`, `/api/tours/`).
   * Вся трансформация выполнена в отдельной ветке `refactor/tours-domain` и зафиксирована через Pull Request.

---

## Почему переход на кастомного пользователя потребовал пересоздания базы (Lab 3)

Django использует `AUTH_USER_MODEL` для определения таблицы пользователей. Эта таблица создаётся
**первой**, и на неё ссылаются встроенные приложения `admin`, `auth` и `sessions` в своих миграциях.

Если база уже создана со стандартной `auth_user`, а затем в конфигурацию добавляется `AUTH_USER_MODEL = "accounts.User"`,
Django фиксирует несоответствие графа миграций: `admin.0001_initial` уже применён и ссылается на старую таблицу,
а `accounts.0001_initial` ещё не применён. Это приводит к ошибке `InconsistentMigrationHistory`.

**Вывод:** кастомную модель пользователя необходимо закладывать **в самом начале проекта**, до первого `migrate`.
В живом продакшене смена модели пользователя требует сложной ручной миграции данных.

---

## Стек технологий

- **Backend:** Python 3.12 + Django 6.x + Django REST Framework + django-environ
- **База данных:** PostgreSQL 16 (в Docker Compose)
- **Инфраструктура:** Docker Desktop + Docker Compose
- **Отладка:** django-debug-toolbar (в dev-режиме)
- **Frontend:** HTML5 / CSS3 / Django Templates

---

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
│   ├── urls.py          # Корневые маршруты + debug_toolbar_urls в dev
│   └── wsgi.py
├── tours/               # Приложение туров и направлений (модели, сериализаторы, ViewSets)
├── docker-compose.yml   # PostgreSQL контейнер
├── .env.example         # Шаблон переменных окружения
├── requirements.txt     # Зависимости Python
└── manage.py            # Точка входа (по умолчанию config.settings.dev)
```

---

## Модели данных

### `User` (`accounts.models.User`)
Кастомная модель пользователя на базе `AbstractUser`.
- `phone`: контактный телефон гида / организатора.
- Стандартные поля: `username`, `email`, `first_name`, `last_name`, `password`, `is_staff` и др.

### `Destination` (`tours.models.Destination`)
Направление путешествий (регион / локация).
- `name`: название направления (*Горный Алтай, Байкал, Дагестан, Камчатка, Карелия*).
- `region`: регион или субъект РФ.
- `description`: описание природных и культурных особенностей.
- `is_active`: флаг доступности для бронирования.

### `Tour` (`tours.models.Tour`)
Тур или экспедиция.
- `title`: название тура.
- `tour_type`: категория (*джип-тур, треккинг, экскурсионный, сплав, фототур*).
- `destination`: `ForeignKey` на `Destination` (с `on_delete=models.PROTECT`).
- `price`: стоимость тура (₽).
- `duration_days`: длительность в днях.
- `start_date`: дата отправления группы.
- `max_group_size`: максимальное количество участников.
- `description`: подробная программа путешествия.
- `is_active`: статус активности тура.
- `created_at`: дата добавления в систему.

---

## REST API

Browsable API DRF доступен по адресу: http://127.0.0.1:8000/api/

| Эндпоинт | Методы | Описание |
|---|---|---|
| `/api/` | GET | Корень API — перечень доступных ресурсов |
| `/api/destinations/` | GET, POST | Список туристических направлений / создание нового |
| `/api/destinations/<id>/` | GET, PATCH, DELETE | Просмотр, обновление, удаление направления |
| `/api/tours/` | GET, POST | Список всех туров / добавление нового тура |
| `/api/tours/<id>/` | GET, PATCH, DELETE | Детальная информация, обновление, удаление тура |

---

## Логирование

В `config/settings/base.py` сконфигурирован словарь `LOGGING`:
- Вывод структурированных логов в консоль (`logging.StreamHandler`) в stdout — стандарт для контейнеризованных приложений.
- Уровень логирования конфигурируется через переменную окружения `LOG_LEVEL` (по умолчанию `INFO`).
- В `tours/views.py`:
  - `perform_create`: логирует событие добавления тура на уровне `INFO`.
  - `perform_destroy`: логирует событие удаления тура на уровне `WARNING`.

---

## Отладка SQL и устранение проблемы N+1

В сериализаторе `TourSerializer` используется вычисляемое поле:
```python
destination_name = serializers.CharField(source="destination.name", read_only=True)
```

При выборке списка туров без оптимизации (`Tour.objects.all()`):
- На каждый тур ORM выполняет отдельный SQL-запрос к таблице `tours_destination` за названием направления.
- **Число SQL-запросов ДО оптимизации (N+1):** **11 запросов** на 10 записей (1 общий запрос + 10 повторяющихся к направлениям).

После оптимизации через `select_related("destination")`:
```python
queryset = Tour.objects.select_related("destination").all()
```
- Django ORM формирует один SQL-запрос с `JOIN` таблиц `tours_tour` и `tours_destination`.
- **Число SQL-запросов ПОСЛЕ оптимизации:** **1 запрос**.
