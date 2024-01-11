"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""
import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

from apps.core.routing import websocket_urlpatterns as core_websocket
from apps.lottery.routing import websocket_urlpatterns as lottery_websocket
from apps.giveaway.routing import websocket_urlpatterns as giveaway_websocket

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django_asgi_app = get_asgi_application()

async_websocket_urlpatterns = (core_websocket + lottery_websocket + giveaway_websocket)

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(URLRouter(async_websocket_urlpatterns))
        ),
    }
)
