from django.urls import path
import apps.lottery.views as view


urlpatterns = [
    path('fetch-lottery/', view.fetchLottery.as_view(), name='fetch-lottery'),
    path('request-ticketlottery/', view.requestTicketLottery.as_view(), name='request-ticketlottery'),
    path('fetch-lottery-tickets/', view.fetchTicketsLottery.as_view(), name='fetch-lottery-tickets'),
    path('fetch-lottery-history/', view.fetchHistoryLottery.as_view(), name='fetch-lottery-history'),
]