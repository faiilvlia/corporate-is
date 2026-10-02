# RoomMate RU 🏠

Платформа для поиска соседей и совместной аренды жилья в России.  
Аналог [SpareRoom](https://www.spareroom.co.uk/) / [Roomies](https://www.roomies.com/) — первый подобный сервис на российском рынке.

## Почему переход на кастомного пользователя потребовал пересоздания базы

Django использует `AUTH_USER_MODEL` для определения таблицы пользователей. Эта таблица создаётся
**первой**, и на неё ссылаются встроенные приложения `admin`, `auth` и `sessions` в своих миграциях.

Если база уже создана со стандартной `auth_user`, а потом добавить `AUTH_USER_MODEL = "accounts.User"`,
Django увидит противоречие: `admin.0001_initial` уже применён (он ссылается на `auth_user`),
а `accounts.0001_initial` ещё нет. Это приводит к ошибке `InconsistentMigrationHistory`.

**Вывод:** кастомную модель пользователя нужно заводить **в самом начале проекта**, до первого `migrate`.
В живом продакшене исправить это без потери данных крайне сложно.

## О проекте

Сервис позволяет арендодателям размещать объявления о свободных комнатах, а ищущим жильё — находить подходящих соседей по параметрам: город, цена, тип комнаты, дата заезда.

## Стек технологий

- **Backend:** Python 3.12 + Django 6.x
- **База данных:** PostgreSQL 16 (запускается через Docker Compose)
- **Инфраструктура:** Docker Desktop + Docker Compose
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

Содержимое `.env`:
```
POSTGRES_DB=corporate_is
POSTGRES_USER=corporate_is
POSTGRES_PASSWORD=corporate_is_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
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

---

## Структура проекта

```
corporate-is/
├── config/          # Настройки Django (settings, urls, wsgi)
├── listings/        # Приложение: объявления о комнатах
│   ├── models.py    # Модель Listing
│   └── admin.py     # Регистрация в admin panel
├── docker-compose.yml  # PostgreSQL контейнер
├── .env.example     # Шаблон переменных окружения
├── requirements.txt # Зависимости Python
└── manage.py
```

## Модель данных (Lab 1)

### `Listing` — Объявление о комнате

| Поле | Тип | Описание |
|------|-----|----------|
| `title` | CharField | Заголовок объявления |
| `room_type` | CharField (choices) | Тип: отдельная / совместная / студия |
| `city` | CharField | Город |
| `address` | CharField | Адрес |
| `price_per_month` | DecimalField | Цена в месяц (₽) |
| `available_from` | DateField | Дата заезда |
| `description` | TextField | Подробное описание |
| `is_active` | BooleanField | Активно ли объявление |
| `created_at` | DateTimeField | Дата создания (авто) |

---

## REST API (Lab 2)

После запуска сервера доступен browsable API DRF по адресу http://127.0.0.1:8000/api/

| Эндпоинт | Методы | Описание |
|----------|--------|----------|
| `/api/` | GET | Корень API — список всех эндпоинтов |
| `/api/cities/` | GET, POST | Список городов / создать город |
| `/api/cities/<id>/` | GET, PATCH, DELETE | Один город |
| `/api/listings/` | GET, POST | Список объявлений / создать |
| `/api/listings/<id>/` | GET, PATCH, DELETE | Одно объявление |

### Пример запросов

```bash
# Получить список объявлений
curl http://127.0.0.1:8000/api/listings/

# Создать город
curl -X POST http://127.0.0.1:8000/api/cities/ -H "Content-Type: application/json" -d '{"name": "Новосибирск", "region": "Новосибирская область", "population": 1621000, "is_active": true}'

# Создать объявление
curl -X POST http://127.0.0.1:8000/api/listings/ -H "Content-Type: application/json" -d '{"title": "Комната у метро", "room_type": "private", "city": 1, "address": "ул. Ленина, 5", "price_per_month": "12000.00", "available_from": "2026-10-01", "is_active": true}'

# Обновить цену
curl -X PATCH http://127.0.0.1:8000/api/listings/1/ -H "Content-Type: application/json" -d '{"price_per_month": "13500.00"}'
```
