from django.urls import path
import apps.giveaway.views as view


urlpatterns = [
    path('fech-giveaway/', view.fechGiveaway.as_view(), name='fech-giveaway'),
]