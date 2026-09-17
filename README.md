# Название в разработке 🏠

Платформа для поиска соседей и совместной аренды жилья в России.  
Аналог [SpareRoom](https://www.spareroom.co.uk/) / [Roomies](https://www.roomies.com/) — первый подобный сервис на российском рынке.

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
