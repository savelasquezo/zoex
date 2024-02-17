from django.urls import path, re_path
import apps.giveaway.views as view


urlpatterns = [
    path('fetch-giveaway/', view.fetchGiveaway.as_view(), name='fetch-giveaway'),
    path('fetch-all-giveaway-tickets/', view.fetchAllTicketsGiveaway.as_view(), name='fetch-all-giveaway-tickets'),
    path('request-ticketgiveaway/', view.requestTicketGiveaway.as_view(), name='request-ticketgiveaway'),
    path('make-ticket-giveaway/', view.makeTicketGiveaway.as_view(), name='make-ticket-giveaway'),
    re_path(r'fetch-giveaway-tickets/(?P<giveawayId>\d+)', view.fetchTicketsGiveaway.as_view(), name='fetch-giveaway-tickets'),
]