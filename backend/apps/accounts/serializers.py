from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import PatientProfile

User = get_user_model()


class PatientRegisterSerializer(serializers.ModelSerializer):
    full_name      = serializers.CharField(write_only=True)
    dob            = serializers.DateField(write_only=True)
    gender         = serializers.CharField(write_only=True)
    contact_number = serializers.CharField(write_only=True)
    aadhaar_hash   = serializers.CharField(write_only=True)
    password       = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model  = User
        fields = ['username', 'email', 'password',
                  'full_name', 'dob', 'gender', 'contact_number', 'aadhaar_hash']

    def create(self, validated_data):
        # Pop profile fields before creating the User
        profile_fields = {
            'full_name':      validated_data.pop('full_name'),
            'dob':            validated_data.pop('dob'),
            'gender':         validated_data.pop('gender'),
            'contact_number': validated_data.pop('contact_number'),
            'aadhaar_hash':   validated_data.pop('aadhaar_hash'),
        }
        validated_data['role'] = 'PATIENT'
        user = User.objects.create_user(**validated_data)

        import uuid
        PatientProfile.objects.create(
            user=user,
            patient_uid=f"UID{uuid.uuid4().hex[:10].upper()}",
            **profile_fields,
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'role']
