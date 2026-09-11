import json
from django.conf import settings
from django.core.mail import EmailMessage
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from google import genai

from .forms import ContactForm
from .models import ChatHistory, Lead

# Initialize Gemini Client (Uses GEMINI_API_KEY from environment)
client = genai.Client()

SYSTEM_PROMPT = """
You are the AI Assistant for Raja Salman Nadeem (RSN), a Full-Stack Developer & Designer.
Help visitors with questions about Salman's work, experience, and skills (Django, React, Flutter, Python, PostgreSQL).
Key projects include EGC LMS (egccenter.site), WaterLink App, and RSN Portfolio.
If a visitor wants to hire Salman, collect their Name, Contact Info, Project Type, and Budget.
Keep answers concise, modern, and helpful.
"""


def index(request):
    """Renders the single-page portfolio."""
    return render(request, "portfolio/index.html")


@require_http_methods(["POST"])
def contact_view(request):
    """
    Accepts the contact form as JSON (sent via fetch from main.js) and
    forwards it by email. Returns JSON so the frontend can show inline
    success/error states without a page reload.
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"success": False, "error": "Invalid request."}, status=400)

    form = ContactForm(data)
    if not form.is_valid():
        first_error = next(iter(form.errors.values()))[0]
        return JsonResponse({"success": False, "error": first_error}, status=400)

    cleaned = form.cleaned_data
    service_label = dict(ContactForm.SERVICE_CHOICES).get(cleaned["service"], cleaned["service"])

    subject = f"New project inquiry — {service_label}"
    body = (
        f"Name: {cleaned['name']}\n"
        f"Email: {cleaned['email']}\n"
        f"Service requested: {service_label}\n\n"
        f"Message:\n{cleaned['message']}"
    )

    try:
        email = EmailMessage(
            subject=subject,
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.CONTACT_RECIPIENT_EMAIL],
            reply_to=[cleaned["email"]],
        )
        email.send(fail_silently=False)
    except Exception:
        # Log this properly in production (e.g. logging.exception).
        return JsonResponse(
            {"success": False, "error": "Could not send your message right now. Please try again shortly."},
            status=500,
        )

    return JsonResponse({"success": True})


@csrf_exempt
@require_http_methods(["POST"])
def chat_assistant(request):
    """
    Handles AI chatbot queries, fetches responses using Gemini 2.5 Flash,
    and logs conversation history into Neon DB.
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"success": False, "error": "Invalid JSON format."}, status=400)

    user_message = data.get("message", "").strip()
    session_id = data.get("session_id", "anonymous_session")

    if not user_message:
        return JsonResponse({"success": False, "error": "Message content cannot be empty."}, status=400)

    try:
        # Call Gemini API with System Instruction
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_message,
            config=genai.types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.7,
            ),
        )

        bot_reply = response.text

        # Log conversation history in PostgreSQL
        ChatHistory.objects.create(
            session_id=session_id,
            user_message=user_message,
            bot_response=bot_reply
        )

        return JsonResponse({
            "success": True,
            "reply": bot_reply,
            "session_id": session_id
        })

    except Exception as e:
        return JsonResponse(
            {"success": False, "error": "AI service is currently unavailable. Please try again later."},
            status=500
        )