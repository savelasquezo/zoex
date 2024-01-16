from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"app/ws/tickets_giveaway/(?P<id>\w+)/$", consumers.AsyncGiveawayConsumer.as_asgi()),
]