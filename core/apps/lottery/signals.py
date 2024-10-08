import os, base64
from django.conf import settings
from django.utils import timezone
from django.contrib import messages

from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Lottery, TicketsLottery, HistoryLottery
from apps.user.models import UserAccount
from apps.core.models import Core
from apps.core.functions import sendEmailTicket

def getLottery():
    return Lottery.objects.get(is_active=True)

def getTickets(lottery):
    return list(TicketsLottery.objects.filter(lottery=lottery).values_list('ticket', flat=True))

def geAviableTickets(lottery):
    lottery = getLottery()
    aviable_tickets = [str(i).zfill(len(str(lottery.tickets))) for i in range((lottery.tickets+1))]
    queryset = getTickets(lottery)
    tickets = [i for i in aviable_tickets if i not in queryset]
    return {'tickets': tickets}


@receiver(post_save, sender=Lottery)
def signalLottery(sender, instance, **kwargs):
    """
    Signal handler for pre-saving Lottery instances.
    """
    # Disconnect the Signal-Temporarily
    post_save.disconnect(signalLottery, sender=Lottery)

    try:
        getWinner = TicketsLottery.objects.filter(lottery=instance,ticket=instance.winner)
        stream = Core.objects.get(default="ZoeXConfig").stream

        data = {'winner':instance.winner,'price':instance.price,'sold':instance.sold,'total':instance.total,'stream':stream}

        if instance.winner:
            obj = HistoryLottery.objects.create(lottery=instance.lottery,**data)

        if getWinner.exists():

            #Disable Current Lottery
            instance.is_active = False
            instance.stream = stream
            instance.total = instance.amount - instance.prize
            instance.date_results = timezone.now()
            instance.save()

            #Disable All Current Tickets
            TicketsLottery.objects.filter(lottery=instance).update(state=False)

            #Update Balance Winner
            user = UserAccount.objects.get(email=getWinner.first().email)
            user.balance =+ user.balance + instance.prize
            user.save()

            #Create New Lottery
            newLottery = "X0" + str(101 + instance.id)
            Lottery.objects.create(lottery=newLottery,file=instance.file,mfile=instance.mfile)
            obj.is_active = True
            obj.save()

            #SendMail Winner
            image64 = base64.b64encode(instance.file).decode('utf-8')
            sendEmailTicket('email/congratulations.html',f'¡Felicidades! {instance.winner} - Ticket Ganador!', user.email, image64, 0)

            
    except Exception as e:
        eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
        with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
            f.write("signalLottery {} --> Error: {}\n".format(eDate, str(e)))

    finally:
        #Delete current ticket without winner
        if instance.winner is not None and not getWinner.exists():
            instance.winner = ""
            instance.save()
        post_save.connect(signalLottery, sender=Lottery)


@receiver(post_save, sender=TicketsLottery)
@receiver(post_delete, sender=TicketsLottery)
def signalTicketsLottery(sender, instance, **kwargs):
    """
    Signal handler for post-save and post-delete events of TicketsLottery instances.
    This signal is triggered after saving or deleting a TicketsLottery instance. It updates
    the associated Lottery instance's sold and amount fields based on the current active tickets.
    Additionally, it sends an asynchronous signal to update available tickets to clients.
    """

    try:
        #Calculate current sold ammount
        currentLottery = instance.lottery
        currentTickets = TicketsLottery.objects.filter(lottery=currentLottery).count()
        currentLottery.sold = currentTickets
        currentLottery.amount = currentLottery.price*currentTickets
        currentLottery.save()

        channel_layer = get_channel_layer()
        data = geAviableTickets(lottery=instance)
        async_to_sync(channel_layer.group_send)(
            "groupTicketsLottery",
            {
                "type": "asyncSignal",
                "data": data,
            }
        )

    except Exception as e:
        eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
        with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
            f.write("signalTicketsLottery {} --> Error: {}\n".format(eDate, str(e)))