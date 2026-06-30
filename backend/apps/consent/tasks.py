from celery import shared_task
from django.utils import timezone
from .models import ConsentRequest


@shared_task
def expire_old_consents():
    expired_count = ConsentRequest.objects.filter(
        status__in=['PENDING', 'APPROVED'],
        expires_at__lte=timezone.now()
    ).update(status='EXPIRED')
    return f"{expired_count} consents marked EXPIRED"


@shared_task
def send_otp_task(appointment_id):
    from .models import Appointment
    from .utils import generate_otp, hash_otp
    appointment = Appointment.objects.get(id=appointment_id)
    otp = generate_otp()
    appointment.otp_hash = hash_otp(otp)
    appointment.save()
    print(f"[SIMULATED SMS] Appointment {appointment_id} OTP: {otp}")
    return otp