from django.urls import path
import apps.core.views as view


urlpatterns = [
    path('fech-sliders/', view.fechImagesSlider.as_view(), name='fech-sliders'),
]