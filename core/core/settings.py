"""
Django settings for core project.

Generated by 'django-admin startproject' using Django 4.2.4.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""
from pathlib import Path
from datetime import timedelta

import os
import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Environment variable patch / '.env'.
env = environ.Env()
environ.Env.read_env()

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY")

CONFIRMO_KEY_DEVS = os.getenv('CONFIRMO_KEY_DEVS')
CONFIRMO_KEY_TEST = os.getenv('CONFIRMO_KEY_TEST')

APILAYER_KEY = os.getenv('APILAYER_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = "DEBUG" not in os.environ

# CorsHeaders
ALLOWED_HOSTS = ["*"]
CORS_ALLOW_ALL_ORIGINS = True

CORS_DEBUG = True
DEBUG_PROPAGATE_EXCEPTIONS = True
CORS_ALLOW_REQUESTS_FROM_NO_REFERER = True


# Logging File
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'logs', 'core.log'),
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

# Application definition

DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'daphne',
    'django.contrib.staticfiles',
]

CORE_APPS = [
    'apps.core',
    'apps.user',
    'apps.lottery',
    'apps.giveaway',
]

THIRD_APPS = [
    "corsheaders",
    'rest_framework',
    'rest_framework_api',
    'djoser',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'channels',
    "ckeditor",
    "ckeditor_uploader",
]

CKEDITOR_CONFIGS = {"default": {"toolbar": "full", "autoParagraph": False}}
CKEDITOR_UPLOAD_PATH = "/ckeditor/"

INSTALLED_APPS = DJANGO_APPS + THIRD_APPS + CORE_APPS

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"
ASGI_APPLICATION = "core.asgi.application"

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": "zoex",
        "USER": "postgres",
        "PASSWORD": "4oPn2655Lmn",
        "HOST": "localhost",
        "PORT": "5432",
    }
}


CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://localhost:6379",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}



CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('localhost', 6379)],
        },
    },
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
]

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'es'

TIME_ZONE = 'America/Bogota'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles/')
STATICFILES_DIRS = [BASE_DIR/"static"]

# Media files (video, text, Images)
MEDIA_ROOT = os.path.join(BASE_DIR, '')
MEDIA_URL = '/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = "user.UserAccount"

REST_FRAMEWORK = {
   'DEFAULT_AUTHENTICATION_CLASSES': (
       'rest_framework_simplejwt.authentication.JWTAuthentication',
   ),
}

LOGIN_REDIRECT_URL = "localhost:3000"
LOGOUT_REDIRECT_URL = "zoexbet.com"

# Authentication Backends
AUTHENTICATION_BACKENDS =(
    "django.contrib.auth.backends.ModelBackend",
)

SIMPLE_JWT = {
    "AUTH_HEADER_TYPES": ("JWT",),
    "ACCESS_TOKEN_LIFETIME": timedelta(days=7),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=15),
    "BLACKLIST_AFTER_ROTATION": True,
    "ROTATE_REFRESFH_TOKENS": True,
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
}

# Djoser
DJOSER = {
    "LOGIN_FIELD": "email",
    "USER_CREATE_PASSWORD_RETYPE": True,
    "USERNAME_CHANGED_EMAIL_CONFIRMATION": True,
    "PASSWORD_CHANGED_EMAIL_CONFIRMATION": True,
    "SEND_CONFIRMATION_EMAIL": True,
    "SEND_ACTIVATION_EMAIL": True,
    "SET_USERNAME_RETYPE": True,
    "PASSWORD_RESET_CONFIRM_URL": "?forgot_password_confirm=True&uid={uid}&token={token}",
    "SET_PASSWORD_RETYPE": True,
    "PASSWORD_RESET_CONFIRM_RETYPE": True,
    "USERNAME_RESET_CONFIRM_URL": "email/reset/confirm/{uid}/{token}",
    "ACTIVATION_URL": "?auth=True&uid={uid}&token={token}",
    "SERIALIZERS": {
        "user_create": "apps.user.serializers.UserSerializer",
        "user": "apps.user.serializers.UserSerializer",
        "current_user": "apps.user.serializers.UserSerializer",
        "user_delete": "djoser.serializers.UserDeleteSerializer",
        "password_reset_confirm": "apps.user.serializers.CustomPasswordResetConfirmSerializer",
    },
    "TEMPLATES": {
        "activation": "email/activation.html",
        "confirmation": "email/confirmation.html",
        "password_reset": "email/password_reset.html",
        "password_changed_confirmation": "email/password_changed_confirmation.html",
    },
}

DATA_UPLOAD_MAX_MEMORY_SIZE = 52428800
FILE_UPLOAD_MAX_MEMORY_SIZE = 52428800

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

#SECURE_SSL_REDIRECT = True
if not DEBUG:

    #SECURE_SSL_REDIRECT = True
    #CORS_ALLOW_ALL_ORIGINS = True
    #ALLOWED_HOSTS = ["217.196.63.210","localhost:3000","zoexbet.com"]
    #CORS_ORIGIN_WHITELIST = ["217.196.63.210","localhost:3000","zoexbet.com"]
    #CORS_ALLOWED_ORIGINS = ["http://localhost:3000","http://217.196.63.210:3000","https://zoexbet.com",]

    MEDIA_ROOT = '/var/www/zoex/media/'
    MEDIA_URL = '/media/'

    #EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    #EMAIL_HOST = 'smtp.hostinger.com'
    #EMAIL_HOST_USER = 'noreply@zoexbet.com'
    #EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
    #EMAIL_USE_SSL = True
    #EMAIL_PORT = 465


