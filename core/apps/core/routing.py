from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/imagen-slider-updates/", consumers.AsyncImageSliderConsumer.as_asgi()),
]