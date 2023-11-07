from django.urls import path
import apps.lottery.views as view


urlpatterns = [
    path('fech-lottery/', view.fechLottery.as_view(), name='fech-lottery'),
]