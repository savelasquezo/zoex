from .settings  import *

DEBUG = False
ALLOWED_HOSTS = ["zoexbet.com","www.zoexbet.com"]

CORS_ORIGIN_WHITELIST = ['https://zoexbet.com','https://www.zoexbet.com']
CSRF_TRUSTED_ORIGINS = ['https://zoexbet.com','https://www.zoexbet.com']
CORS_ALLOWED_ORIGINS = ['https://zoexbet.com','https://www.zoexbet.com']

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = 'smtp.hostinger.com'
EMAIL_HOST_USER = 'noreply@zoexbet.com'
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
EMAIL_USE_SSL = True
EMAIL_PORT = 465

