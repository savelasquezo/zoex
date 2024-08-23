from django.urls import path
import apps.minilottery.views as view


urlpatterns = [
    path('fetch-minilottery/', view.fetchMiniLottery.as_view(), name='fetch-minilottery'),
    path('request-ticketminilottery/', view.requestTicketMiniLottery.as_view(), name='request-ticketminilottery'),
    path('fetch-minilottery-tickets/', view.fetchTicketsMiniLottery.as_view(), name='fetch-minilottery-tickets'),
    path('fetch-all-minilottery-tickets/', view.fetchAllTicketsMiniLottery.as_view(), name='fetch-all-minilottery-tickets'),
    path('make-ticket-minilottery', view.makeTicketMiniLottery.as_view(), name='make-ticket-minilottery'),
    path('fetch-minilottery-history/', view.fetchHistoryMiniLottery.as_view(), name='fetch-minilottery-history'),    
]