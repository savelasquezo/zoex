from django.urls import path
import apps.core.views as view


urlpatterns = [
    path('fetch-sliders/', view.fetchImagesSlider.as_view(), name='fetch-sliders'),
    path('fetch-info/', view.fetchInfo.as_view(), name='fetch-info'),
    path('send-message/', view.fetchMessage.as_view(), name='send-message'),
]