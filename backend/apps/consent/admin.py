from django.contrib import admin
from .models import ConsentRequest, Appointment

@admin.register(ConsentRequest)
class ConsentRequestAdmin(admin.ModelAdmin):
    list_display = ('patient', 'hospital', 'requested_by', 'status', 'consent_method', 'expires_at', 'requested_at')
    list_filter = ('status', 'hospital')
    search_fields = ('patient__full_name',)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'hospital', 'appointment_date', 'access_method', 'status')
    list_filter = ('status', 'access_method', 'hospital')