from django.contrib import admin
from .models import MedicalRecord, PrescriptionItem


class PrescriptionItemInline(admin.TabularInline):
    model = PrescriptionItem
    extra = 0


@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ('title', 'record_type', 'patient', 'hospital', 'created_by', 'created_at')
    list_filter = ('record_type', 'hospital')
    search_fields = ('title', 'patient__full_name')
    inlines = [PrescriptionItemInline]


@admin.register(PrescriptionItem)
class PrescriptionItemAdmin(admin.ModelAdmin):
    list_display = ('tablet_name', 'dosage', 'frequency', 'duration', 'record')
    search_fields = ('tablet_name',)