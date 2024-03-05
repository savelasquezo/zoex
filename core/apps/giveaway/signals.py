import os
from django.conf import settings
from django.utils import timezone
from django.contrib import messages

from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Giveaway, TicketsGiveaway
from ..core.models import Core

def getGiveaway(id):
    return Giveaway.objects.get(pk=id)

def getTickets(giveaway):
    return list(TicketsGiveaway.objects.filter(giveaway=giveaway).values_list('ticket', flat=True))

def geAviableTickets(id):
    giveaway = getGiveaway(id)
    AviableTickets = [str(i).zfill(len(str(giveaway.tickets))) for i in range((giveaway.tickets+1))]
    Tickets = getTickets(giveaway)
    iTickets = [i for i in AviableTickets if i not in Tickets]
    return {'iTickets': iTickets}


@receiver(pre_save, sender=Giveaway)
def signalGiveaway(sender, instance, **kwargs):
    """
    Signal handler for pre-saving Giveaway instances.
    """
    # Disconnect the Signal-Temporarily
    pre_save.disconnect(signalGiveaway, sender=Giveaway)

    try:
        getWinner = TicketsGiveaway.objects.filter(giveaway=instance,ticket=instance.winner, state=True)
        if instance.winner is not None and getWinner.exists():
            stream = Core.objects.get(default="ZoeXConfig").stream

            instance.is_active = False
            instance.stream = stream
            instance.date_results = timezone.now()

            instance.save()

            #Disable OldTickets
            TicketsGiveaway.objects.filter(giveaway=instance).update(state=False)

    except Exception as e:
        eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
        with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
            f.write("signalGiveaway {} --> Error: {}\n".format(eDate, str(e)))

    finally:
        pre_save.connect(signalGiveaway, sender=Giveaway)


@receiver(post_save, sender=TicketsGiveaway)
@receiver(post_delete, sender=TicketsGiveaway)
def signalTicketsGiveaway(sender, instance, **kwargs):
        
    try:
        #Calculate current sold ammount
        currentGiveaway = instance.giveaway
        currentTickets = TicketsGiveaway.objects.filter(giveaway=currentGiveaway).count()
        currentGiveaway.sold = currentTickets
        currentGiveaway.amount = currentGiveaway.price*currentTickets
        currentGiveaway.save()

        channel_layer = get_channel_layer()
        data = geAviableTickets(id=instance.giveaway.id)
        async_to_sync(channel_layer.group_send)(
            "groupTicketsGiveaway",
            {
                "type": "asyncSignal",
                "data": data,
            }
        )

    except Exception as e:
        eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
        with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
            f.write("signalTicketsGiveaway {} --> Error: {}\n".format(eDate, str(e)))
