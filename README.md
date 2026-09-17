# Corporate IS — Lab 1

Корпоративная информационная система — лабораторная работа №1.

## Стек технологий

- **Python 3.12** + **Django 5.x**
- **PostgreSQL 16** (запускается через Docker Compose)
- **Docker Desktop** + **Docker Compose**

## Как запустить проект

### 1. Клонировать репозиторий

```bash
git clone https://github.com/faiilvlia/corporate-is.git
cd corporate-is
```

### 2. Создать виртуальное окружение и установить зависимости

```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Создать файл `.env` (скопировать из примера)

```bash
cp .env.example .env
# Отредактировать .env при необходимости
```

### 4. Поднять PostgreSQL через Docker Compose

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

## Идея мини-ИС для итогового проекта

**Корпоративная система управления сотрудниками** — внутренний инструмент HR-отдела компании:
- Учёт сотрудников (ФИО, должность, дата приёма)
- Отделы и привязка сотрудников к отделам
- Задачи и назначение задач сотрудникам
- Права доступа: HR-менеджер видит всё, обычный сотрудник — только своё
