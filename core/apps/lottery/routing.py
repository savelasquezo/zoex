from django.urls import re_path
from .consumers import AsyncLotteryConsumer, AsyncTicketsConsumer

websocket_urlpatterns = [
    re_path(r"app/ws/tickets_lottery/", AsyncLotteryConsumer.as_asgi()),
    re_path(r'app/ws/tickets/(?P<username>\w+)/$', AsyncTicketsConsumer.as_asgi()),
]

