from rest_framework import serializers
from django.utils import timezone
from .models import ConsentRequest, Appointment


class ConsentRequestSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    doctor_name = serializers.SerializerMethodField()
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)

    def get_doctor_name(self, obj):
        return obj.requested_by.user.get_full_name() or obj.requested_by.user.username

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

    def validate(self, data):
        if data.get('expires_at') and data['expires_at'] <= timezone.now():
            raise serializers.ValidationError("expires_at must be in the future")
        return data


class ConsentRespondSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['APPROVE', 'DENY'])


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = [
            'id', 'otp_hash', 'otp_verified',
            'verified_by_staff', 'status', 'created_at'
        ]


class OTPVerifySerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6, min_length=6)