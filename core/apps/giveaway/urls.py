from django.urls import path, re_path
import apps.giveaway.views as view


urlpatterns = [
    path('fetch-giveaway/', view.fetchGiveaway.as_view(), name='fetch-giveaway'),
    path('request-ticketgiveaway/', view.requestTicketGiveaway.as_view(), name='request-ticketgiveaway'),
    re_path(r'fetch-giveaway-tickets/(?P<giveawayId>\d+)', view.fetchTicketsGiveaway.as_view(), name='fetch-giveaway-tickets'),
]