from .settings  import *

DEBUG = False
ALLOWED_HOSTS = ["example.com","www.example.com"]

CORS_ORIGIN_WHITELIST = ['https://example.com','https://www.example.com']
CSRF_TRUSTED_ORIGINS = ['https://example.com','https://www.example.com']


EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = 'smtp.hostinger.com'
EMAIL_HOST_USER = 'noreply@example.com'
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
EMAIL_USE_SSL = True
EMAIL_PORT = 465

