from .settings  import *

DEBUG = False
ALLOWED_HOSTS = ["167.71.28.44","zoexbet.com","www.zoexbet.com"]

CSRF_TRUSTED_ORIGINS = ['https://zoexbet.com','https://www.zoexbet.com']

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = 'smtp.hostinger.com'
EMAIL_HOST_USER = 'noreply@zoexbet.com'
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
EMAIL_USE_SSL = True
EMAIL_PORT = 465

MEDIA_ROOT = '/var/www/zoex/media/'
MEDIA_URL = '/media/'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/app/zoex/core/logs/django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}

