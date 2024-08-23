import os, base64
from django.conf import settings
from django.utils import timezone
from django.contrib import messages

from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import MiniLottery, TicketsMiniLottery, HistoryMiniLottery
from apps.user.models import UserAccount
from apps.core.models import Core
from apps.core.functions import sendEmailTicket

def getMiniLottery():
    return MiniLottery.objects.get(is_active=True)

def getTickets(minilottery):
    return list(TicketsMiniLottery.objects.filter(minilottery=minilottery).values_list('ticket', flat=True))

def geAviableTickets(minilottery):
    minilottery = getMiniLottery()
    aviable_tickets = [str(i).zfill(len(str(minilottery.tickets))) for i in range((minilottery.tickets+1))]
    queryset = getTickets(minilottery)
    tickets = [i for i in aviable_tickets if i not in queryset]
    return {'tickets': tickets}


@receiver(post_save, sender=MiniLottery)
def signalMiniLottery(sender, instance, **kwargs):
    """
    Signal handler for pre-saving MiniLottery instances.
    """
    # Disconnect the Signal-Temporarily
    post_save.disconnect(signalMiniLottery, sender=MiniLottery)

    try:
        getWinner = TicketsMiniLottery.objects.filter(minilottery=instance,ticket=instance.winner)
        stream = Core.objects.get(default="ZoeXConfig").stream

        data = {'winner':instance.winner,'price':instance.price,'sold':instance.sold,'total':instance.total,'stream':stream}

        if instance.winner:
            obj = HistoryMiniLottery.objects.create(minilottery=instance.minilottery,**data)

        if getWinner.exists():

            #Disable Current MiniLottery
            instance.is_active = False
            instance.stream = stream
            instance.total = instance.amount - instance.prize
            instance.date_results = timezone.now()
            instance.save()

            #Disable All Current Tickets
            TicketsMiniLottery.objects.filter(minilottery=instance).update(state=False)

            #Update Balance Winner
            user = UserAccount.objects.get(email=getWinner.first().email)
            user.balance =+ user.balance + instance.prize
            user.save()

            #Create New Lottery
            MiniLottery.objects.create(file=instance.file,mfile=instance.mfile)
            obj.is_active = True
            obj.save()

            #SendMail Winner
            image64 = base64.b64encode(instance.file).decode('utf-8')
            sendEmailTicket('email/congratulations.html',f'¡Felicidades! {instance.winner} - Ticket Ganador!', user.email, image64, 0)

            
    except Exception as e:
        eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
        with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
            f.write("signalMiniLottery {} --> Error: {}\n".format(eDate, str(e)))

    finally:
        #Delete current ticket without winner
        if instance.winner is not None and not getWinner.exists():
            instance.winner = ""
            instance.save()
        post_save.connect(signalMiniLottery, sender=MiniLottery)



@receiver(post_save, sender=TicketsMiniLottery)
@receiver(post_delete, sender=TicketsMiniLottery)
def signalTicketsLottery(sender, instance, **kwargs):
    """
    Signal handler for post-save and post-delete events of TicketsMiniLottery instances.
    This signal is triggered after saving or deleting a TicketsMiniLottery instance. It updates
    the associated MiniLottery instance's sold and amount fields based on the current active tickets.
    Additionally, it sends an asynchronous signal to update available tickets to clients.
    """

    try:
        #Calculate current sold ammount
        currentMiniLottery = instance.minilottery
        currentTickets = TicketsMiniLottery.objects.filter(minilottery=currentMiniLottery).count()
        currentMiniLottery.sold = currentTickets
        currentMiniLottery.amount = currentMiniLottery.price*currentTickets
        currentMiniLottery.save()

        channel_layer = get_channel_layer()
        data = geAviableTickets(minilottery=instance)
        async_to_sync(channel_layer.group_send)(
            "groupTicketsMiniLottery",
            {
                "type": "asyncSignal",
                "data": data,
            }
        )

    except Exception as e:
        eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
        with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
            f.write("signalTicketsMiniLottery {} --> Error: {}\n".format(eDate, str(e)))