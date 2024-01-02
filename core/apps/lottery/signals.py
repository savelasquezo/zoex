import os
from django.conf import settings
from django.utils import timezone

from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from . import models
from ..core.models import Core

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


@receiver(pre_save, sender=models.Lottery)
def signalLottery(sender, instance, **kwargs):
    """
    Signal handler for pre-saving Lottery instances.
    """
    # Disconnect the Signal-Temporarily
    pre_save.disconnect(signalLottery, sender=models.Lottery)

    try:
        getWinner = models.TicketsLottery.objects.filter(lottery=instance,ticket=instance.winner, is_active=True)
        if instance.winner is not None and getWinner.exists():
            instance.is_active = False
            instance.stream = Core.objects.all().first().stream
            instance.date_results = timezone.now()

            instance.save()

            newLottery = models.Lottery.objects.create(banner=instance.banner)
            newHistoryTotal = instance.amount - instance.prize

            obj, newHistoryLottery = models.HistoryLottery.objects.get_or_create(
                lottery=instance.lottery,
                prize=instance.prize,
                tickets=instance.tickets,
                price=instance.price,
                winner=instance.winner,
                sold=instance.sold,
                amount=instance.amount,
                total = newHistoryTotal,
                date_results=instance.date_results,
                stream=instance.stream

            )

    except Exception as e:
        eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
        with open(os.path.join(settings.BASE_DIR, 'logs/signals.log'), 'a') as f:
            f.write("signalLottery {} --> Error: {}\n".format(eDate, str(e)))

    finally:
        # Reconnect the Signal
        pre_save.connect(signalLottery, sender=models.Lottery)
        
        
@receiver(post_save, sender=models.TicketsLottery)
@receiver(post_delete, sender=models.TicketsLottery)
def signalTicketsLottery(sender, instance, **kwargs):
    """
    Signal handler for post-save and post-delete events of TicketsLottery instances.
    This signal is triggered after saving or deleting a TicketsLottery instance. It updates
    the associated Lottery instance's sold and amount fields based on the current active tickets.
    Additionally, it sends an asynchronous signal to update available tickets to clients.
    """
    lottery = models.Lottery.objects.filter(is_active=True).first()
    currentTickets = models.TicketsLottery.objects.filter(lottery=lottery, is_active=True).count()

    lottery.sold = currentTickets
    lottery.amount = lottery.price*currentTickets
    lottery.save()

    channel_layer = get_channel_layer()
    data = geAviableTickets(lottery=instance)
    async_to_sync(channel_layer.group_send)(
        "groupTicketsLottery",
        {
            "type": "asyncSignal",
            "data": data,
        }
    )


