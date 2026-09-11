from django import forms


class ContactForm(forms.Form):
    SERVICE_CHOICES = [
        ("web_development", "Web Development"),
        ("ui_ux_design", "UI/UX Design"),
        ("ecommerce", "E-commerce Solutions"),
        ("brand_identity", "Brand Identity"),
        ("other", "Other"),
    ]

    name = forms.CharField(max_length=120)
    email = forms.EmailField()
    service = forms.ChoiceField(choices=SERVICE_CHOICES)
    message = forms.CharField(widget=forms.Textarea)

    def clean_name(self):
        name = self.cleaned_data["name"].strip()
        if len(name) < 2:
            raise forms.ValidationError("Please enter your name.")
        return name

    def clean_message(self):
        message = self.cleaned_data["message"].strip()
        if len(message) < 10:
            raise forms.ValidationError("Please add a few more details about your project.")
        return message
