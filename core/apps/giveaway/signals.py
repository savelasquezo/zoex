from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

import apps.giveaway.models as models

def getGiveaway(id):
    return models.Giveaway.objects.get(pk=id)

def getTickets(giveaway):
    return list(models.TicketsGiveaway.objects.filter(giveaway=giveaway).values_list('ticket', flat=True))

def geAviableTickets(id):
    giveaway = getGiveaway(id)
    AviableTickets = [str(i).zfill(len(str(giveaway.tickets))) for i in range((giveaway.tickets+1))]
    Tickets = getTickets(giveaway)
    iTickets = [i for i in AviableTickets if i not in Tickets]
    return {'iTickets': iTickets}


@receiver(post_save, sender=models.TicketsGiveaway)
@receiver(post_delete, sender=models.TicketsGiveaway)
def signalTicketsGiveaway(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    data = geAviableTickets(id=instance.giveaway.id)
    async_to_sync(channel_layer.group_send)(
        "groupTicketsGiveaway",
        {
            "type": "asyncSignal",
            "data": data,
        }
    )


