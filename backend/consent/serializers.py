from rest_framework import serializers
from django.utils import timezone
from .models import ConsentRequest


class ConsentRequestSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(
        source='patient.full_name', read_only=True
    )
    doctor_name = serializers.CharField(
        source='requested_by.user.get_full_name', read_only=True
    )
    hospital_name = serializers.CharField(
        source='hospital.name', read_only=True
    )

    class Meta:
        model = ConsentRequest
        fields = [
            'id', 'patient', 'patient_name',
            'hospital', 'hospital_name',
            'requested_by', 'doctor_name',
            'status', 'consent_method',
            'appointment',
            'requested_at', 'resolved_at', 'expires_at',
        ]
        read_only_fields = [
            'id', 'status', 'consent_method',
            'requested_at', 'resolved_at',
            'requested_by', 'hospital',
        ]


class ConsentRespondSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['APPROVE', 'DENY'])