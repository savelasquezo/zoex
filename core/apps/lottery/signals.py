from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

import apps.lottery.models as models

def getLottery():
    return models.Lottery.objects.get(is_active=True)

def getTickets(lottery):
    return list(models.TicketsLottery.objects.filter(lottery=lottery).values_list('ticket', flat=True))

def geAviableTickets(lottery):
    lottery = getLottery()
    AviableTickets = [str(i).zfill(len(str(lottery.tickets))) for i in range((lottery.tickets+1))]
    Tickets = getTickets(lottery)
    iTickets = [i for i in AviableTickets if i not in Tickets]
    return {'iTickets': iTickets}


@receiver(post_save, sender=models.TicketsLottery)
@receiver(post_delete, sender=models.TicketsLottery)
def signalTicketsLottery(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    data = geAviableTickets(lottery=instance)
    async_to_sync(channel_layer.group_send)(
        "groupTicketsLottery",
        {
            "type": "asyncSignal",
            "data": data,
        }
    )


