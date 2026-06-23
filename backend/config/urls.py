from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth endpoints (Person 1)
    path('api/auth/', include('apps.accounts.urls')),

    # Hospital & doctor onboarding (Person 2)
    path('api/hospitals/', include('apps.hospitals.urls')),

    # Consent & appointments (Person 3)
    path('api/consent/', include('apps.consent.urls')),

    # Medical records (Person 4)
    path('api/records/', include('apps.records.urls')),
    path('api/audit/',   include('apps.audit.urls')),
]
