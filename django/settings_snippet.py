"""
Add these to your project's settings.py.
Never hardcode credentials in the file itself — read them from environment
variables (e.g. via django-environ or python-decouple) and keep the .env
file out of version control.
"""

import os

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER")          # e.g. hello@rsn.dev
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD")  # Gmail App Password, never a raw account password

DEFAULT_FROM_EMAIL = os.environ.get("EMAIL_HOST_USER")
CONTACT_RECIPIENT_EMAIL = os.environ.get("CONTACT_RECIPIENT_EMAIL", EMAIL_HOST_USER)

# INSTALLED_APPS should include "portfolio" (this app).
# Project urls.py:
#   from django.urls import path, include
#   urlpatterns = [
#       ...
#       path("", include("portfolio.urls")),
#   ]
