from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path(r"ws/tickets_giveaway/", consumers.AsyncGiveawayConsumer.as_asgi()),
]


