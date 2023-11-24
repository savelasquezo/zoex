from django.urls import path
import apps.lottery.views as view


urlpatterns = [
    path('fetch-lottery/', view.fetchLottery.as_view(), name='fetch-lottery'),
    path('fetch-lottery-tickets/', view.fetchTicketsLottery.as_view(), name='fetch-lottery-tickets'),
]