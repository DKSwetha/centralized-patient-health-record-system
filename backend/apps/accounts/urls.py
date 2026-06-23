from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import PatientRegisterView, MeView

urlpatterns = [
    # Patient self-registration
    path('register/patient/', PatientRegisterView.as_view(), name='patient-register'),

    # JWT login (works for all roles — returns access + refresh tokens)
    path('login/',         TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(),   name='token-refresh'),

    # Current user info
    path('me/', MeView.as_view(), name='me'),
]
