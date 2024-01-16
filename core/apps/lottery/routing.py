from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"app/ws/tickets_lottery/", consumers.AsyncLotteryConsumer.as_asgi()),
]

