from django.urls import path

from . import views

app_name = "portfolio"

urlpatterns = [
    path("", views.index, name="index"),
    path("contact/", views.contact_view, name="contact"),
    path("api/chat/", views.chat_assistant, name="chat_assistant"),
]