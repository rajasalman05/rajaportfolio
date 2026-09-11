# models.py
from django.db import models

class Lead(models.Model):
    name = models.CharField(max_length=100)
    email_or_phone = models.CharField(max_length=100)
    project_type = models.CharField(max_length=100)  # Web, Mobile App, UI/UX
    budget = models.CharField(max_length=50, blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.project_type}"

class ChatHistory(models.Model):
    session_id = models.CharField(max_length=100)
    user_message = models.TextField()
    bot_response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)