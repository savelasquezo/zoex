from django.urls import re_path
from .consumers import AsyncMiniLotteryConsumer, AsyncTicketsConsumerMiniLottery

websocket_urlpatterns = [
    re_path(r"app/ws/tickets_minilottery/", AsyncMiniLotteryConsumer.as_asgi()),
    re_path(r'app/ws/tickets_minilottery/(?P<username>\w+)/$', AsyncTicketsConsumerMiniLottery.as_asgi()),
]

