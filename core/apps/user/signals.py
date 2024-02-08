import os
from django.utils import timezone

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from .models import UserAccount, Invoice
from ..core.models import Core

@receiver(post_save, sender=Invoice)
def updateBalance(sender, instance, **kwargs):
    if instance.state == "done" and not kwargs.get('created', False):
        try:
            coreSettings = Core.objects.first()
            account = UserAccount.objects.get(email=instance.account.email)

            #Bonus Credist First Topup
            accourtInvoices = Invoice.objects.filter(account=account,state="done")
            if accourtInvoices.count() == 1:
                account.credits = instance.amount*(coreSettings.bonusPercent/100)

            #Update Balance Referred
            accourtReferred = UserAccount.objects.filter(uuid=account.referred)
            if accourtReferred.exists():
                accourtReferred = accourtReferred.first()
                accourtReferred.balance = accourtReferred.balance + instance.amount*(coreSettings.referredPercent/100)
                accourtReferred.save()

            account.balance = account.balance + instance.amount
            account.save()

        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/signals.log'), 'a') as f:
                f.write("updateBalance {} --> Error: {}\n".format(date, str(e)))
