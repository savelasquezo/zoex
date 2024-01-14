from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"api/ws/tickets_giveaway/(?P<id>\w+)/$", consumers.AsyncGiveawayConsumer.as_asgi()),
]