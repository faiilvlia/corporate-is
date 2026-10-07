# KRAI 🏔️

**Платформа авторских экспедиций, треккинга и джип-туров по диким краям России**  
*(Горный Алтай, Байкал, Дагестан, Камчатка, Карелия)*

Проект разработан в рамках учебного курса корпоративных информационных систем на стеке **Django 6 + PostgreSQL + Docker Compose** и реализует полный цикл: от интерактивного веб-прототипа (Лабы №0 и №0.1) до масштабируемой архитектуры с REST API, разделением настроек и оптимизацией запросов (Лабы №1, №2, №3).

Дизайн-система проекта: **TERRA EXPEDITION** (вдохновлена минимализмом Awwwards: Realevate, Hiroto Sato, Floema).

---

## 🧭 Прототип информационной системы (Лабораторные №0 и №0.1)

В рамках лабораторных работ №0 и №0.1 реализован интерактивный прототип системы подачи и обработки экспедиционных заявок:

### Пользовательские роли и сценарии доступа:
1. **Путешественник / Турист (`ivanov`):**
   * Вход в систему через `/accounts/login/`.
   * Подача заявки на участие в экспедиции через форму `/bookings/new/` с серверной валидацией темы (не менее 5 символов), защитой CSRF и циклом Post/Redirect/Get.
   * Просмотр **только своих заявок** в штабе `/bookings/`.
   * Редактирование заявки доступно **только пока она новая** (до взятия гидом в работу).
   * Попытка открыть чужую заявку возвращает статус `404 Not Found` (сокрытие факта существования чужой информации).
2. **Старший гид / Куратор (`petrov`, группа «Штаб экспедиций»):**
   * Обладает правами `view_booking` и `change_booking`.
   * Просмотр **всех заявок** системы.
   * Полнотекстовый поиск по маршрутам, участникам и описанию через `Q(...)` и фильтрация по статусам (`/bookings/?q=алтай&status=new`).
   * Обработка заявки на странице `/bookings/<id>/`: назначение куратора/гида и перевод в статус «В работе».
   * После взятия в работу турист видит назначенного гида, а кнопка редактирования у туриста блокируется (попытка прямого перехода даёт `403 Forbidden`).
3. **Шеф штаба / Администратор (`admin`):**
   * Полный доступ к админ-панели `/admin/` и всем сущностям системы.

### Автоматические тесты (Лаба №0.1, Часть 9):
Набор из **7 автоматических тестов** (`tours/tests.py`) проверяет разграничение прав доступа и бизнес-правила:
```bash
python manage.py test tours
```
*(Результат: `Ran 7 tests ... OK`)*

---

## 🔑 Учётные записи для проверки

| Роль | Логин | Пароль | Назначение |
|---|---|---|---|
| Турист (путешественник) | `ivanov` | `Zayavka-2026` | Создаёт и правит свои заявки |
| Старший гид экспедиций | `petrov` | `Zayavka-2026` | Состоит в группе «Штаб экспедиций», обрабатывает заявки |
| Администратор | `admin` | `admin1234` | Суперпользователь, доступ в `/admin/` |

---

## 🛠️ Стек технологий

- **Backend:** Python 3.12 + Django 6.x + Django REST Framework + django-environ
- **База данных:** PostgreSQL 16 (запуск через Docker Compose)
- **Инфраструктура:** Docker Desktop + Docker Compose
- **Отладка:** django-debug-toolbar (в dev-окружении)
- **Дизайн-система:** TERRA EXPEDITION (W3C Design Tokens, CSS Variables)

---

## 🚀 Как запустить проект

### 1. Клонировать репозиторий
```bash
git clone https://github.com/faiilvlia/corporate-is.git
cd corporate-is
```

### 2. Создать виртуальное окружение и установить зависимости
```bash
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
SECRET_KEY=0phkxa1qiyiy5+4%8si+h@b18)6v(fyf#r(s9qmk-g(+)=v4#$
DATABASE_URL=postgres://corporate_is:corporate_is_password@localhost:5432/corporate_is
ALLOWED_HOSTS=localhost,127.0.0.1,testserver
DB_CONN_MAX_AGE=60
LOG_LEVEL=INFO
```

### 4. Запустить PostgreSQL через Docker Compose
```bash
docker compose up -d
docker compose ps
```

### 5. Применить миграции
```bash
python manage.py migrate
```

### 6. Запустить сервер разработки
```bash
python manage.py runserver
```

Открыть в браузере:
- **Главная витрина маршрутов KRAI:** http://127.0.0.1:8000/
- **Штаб экспедиционных заявок:** http://127.0.0.1:8000/bookings/
- **Подача заявки:** http://127.0.0.1:8000/bookings/new/
- **Вход в штаб:** http://127.0.0.1:8000/accounts/login/
- **Панель управления (Admin):** http://127.0.0.1:8000/admin/
- **REST API:** http://127.0.0.1:8000/api/

---

## 🗂️ Структура проекта

```text
corporate-is/
├── accounts/            # Кастомная модель пользователя User(AbstractUser) с полем phone
├── config/              # Пакет конфигурации проекта (12-factor app)
│   ├── settings/
│   │   ├── base.py      # Базовые настройки, django-environ, LOGGING
│   │   ├── dev.py       # DEBUG=True, django-debug-toolbar
│   │   └── prod.py      # DEBUG=False, security-заголовки, HSTS, SSL
│   ├── asgi.py
│   ├── urls.py          # Маршрутизация: admin, accounts, tours, api, debug_toolbar
│   └── wsgi.py
├── design-system/       # Дизайн-система TERRA EXPEDITION
│   ├── tokens.json      # W3C Design Tokens (Primitive → Semantic → Component)
│   ├── tokens.css       # Скомпилированные CSS-переменные
│   ├── showcase.html    # Интерактивная витрина компонентов
│   └── docs/            # Спецификации стилей и типографики
├── tours/               # Основное приложение: маршруты, экспедиции и заявки
│   ├── templates/
│   │   ├── tours/       # base.html, home.html, booking_*.html, tour_detail.html
│   │   └── registration/# login.html
│   ├── forms.py         # BookingForm, BookingProcessForm с валидацией clean_title
│   ├── models.py        # Destination, Tour, Booking (с правилом can_be_edited_by)
│   ├── serializers.py   # DRF-сериализаторы
│   ├── tests.py         # 7 автоматических тестов прав доступа (Лаба 0.1)
│   ├── urls.py          # HTML и API маршруты
│   └── views.py         # Контроллеры заявок, прав доступа и DRF ViewSets
├── docker-compose.yml   # Сервис PostgreSQL 16
├── requirements.txt     # Зафиксированные зависимости проекта
└── manage.py
```

---

## 📡 REST API (Lab 2)

| Эндпоинт | Методы | Описание |
|---|---|---|
| `/api/` | GET | Список всех ресурсов API |
| `/api/destinations/` | GET, POST | Туристические направления |
| `/api/destinations/<id>/` | GET, PATCH, DELETE | Детали направления |
| `/api/tours/` | GET, POST | Маршруты и экспедиции |
| `/api/tours/<id>/` | GET, PATCH, DELETE | Детали экспедиции |

---

## ⚡ Оптимизация SQL и устранение проблемы N+1 (Lab 3)

В `TourViewSet` и `booking_list` применяется `select_related("destination")`, что сокращает количество обращений к базе данных с **11 SQL-запросов** до **1 запроса** с `JOIN`.
