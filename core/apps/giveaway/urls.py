from django.urls import path
import apps.giveaway.views as view


urlpatterns = [
    path('fetch-giveaway/', view.fetchGiveaway.as_view(), name='fetch-giveaway'),
    path('fetch-giveaway-tickets/', view.fetchTicketsGiveaway.as_view(), name='fetch-giveaway-tickets'),
]