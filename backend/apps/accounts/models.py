from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model — extends Django's built-in user with a 'role' field.
    Always use get_user_model() or AUTH_USER_MODEL in other apps,
    never import this directly if you can avoid it.
    """
    class Role(models.TextChoices):
        PATIENT        = 'PATIENT',        'Patient'
        DOCTOR         = 'DOCTOR',         'Doctor'
        HOSPITAL_ADMIN = 'HOSPITAL_ADMIN', 'Hospital Admin'

    role       = models.CharField(max_length=20, choices=Role.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


class PatientProfile(models.Model):
    user           = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    patient_uid    = models.CharField(max_length=20, unique=True)  # ABHA-style health ID
    full_name      = models.CharField(max_length=100)
    dob            = models.DateField()
    gender         = models.CharField(max_length=10)
    contact_number = models.CharField(max_length=15)
    address        = models.TextField(blank=True)
    aadhaar_hash   = models.CharField(max_length=64)  # SHA-256 — never store the raw number
    created_at     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} ({self.patient_uid})"
