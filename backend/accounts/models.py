from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class User(AbstractUser):
    ROLE_CHOICES = [
        ('PATIENT', 'Patient'),
        ('DOCTOR', 'Doctor'),
        ('HOSPITAL_ADMIN', 'Hospital Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.username} ({self.role})"


class Hospital(models.Model):
    name = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=100, unique=True)
    address = models.TextField()
    contact_email = models.EmailField()
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    patient_uid = models.CharField(max_length=20, unique=True, editable=False)
    full_name = models.CharField(max_length=255)
    dob = models.DateField()
    gender = models.CharField(max_length=10)
    contact_number = models.CharField(max_length=15)
    address = models.TextField()
    aadhaar_hash = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.patient_uid:
            self.patient_uid = f"PID-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} ({self.patient_uid})"


class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='doctors')
    license_number = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dr. {self.user.get_full_name()} - {self.department}"