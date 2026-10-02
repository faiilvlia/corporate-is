"""Development settings."""
from .base import *  # noqa: F401,F403

DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "testserver"]

# Django Debug Toolbar (только в dev-окружении)
INSTALLED_APPS = list(INSTALLED_APPS) + ["debug_toolbar"]
MIDDLEWARE = ["debug_toolbar.middleware.DebugToolbarMiddleware"] + list(MIDDLEWARE)
INTERNAL_IPS = ["127.0.0.1"]
