import os
from django.utils import timezone

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from .models import UserAccount, Invoice

from apps.core.models import Core
from apps.core.functions import xlsxSave

@receiver(post_save, sender=Invoice)
def updateBalance(sender, instance, **kwargs):
    if instance.state == "done" and not kwargs.get('created', False):
        try:
            coreSettings = Core.objects.first()
            account = instance.account

            currentBalance = account.balance

            #Bonus Credist First Topup
            accourtInvoices = Invoice.objects.filter(account=account,state="done")
            if accourtInvoices.count() == 1:
                account.credits = instance.amount*(coreSettings.bonusPercent/100)

            #Update Balance Referred
            accourtReferred = UserAccount.objects.filter(uuid=account.referred)
            if accourtReferred.exists():
                referred = accourtReferred.first()
                refFee = instance.amount*(coreSettings.referredPercent/100)
                refBalance = referred.balance
                referred.balance = refBalance + refFee
                referred.save()

                newRefered= referred.balance

                xlsxSave(referred.username, "Fees", refFee, refBalance, newRefered, "", "", instance.voucher, instance.method)

            account.balance = currentBalance + instance.amount
            account.save()

            newBalance = account.balance
            xlsxSave(account.username, "TopUP", instance.amount, currentBalance, newBalance, "", "", instance.voucher, instance.method)

        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/signals.log'), 'a') as f:
                f.write("updateBalance {} --> Error: {}\n".format(date, str(e)))


