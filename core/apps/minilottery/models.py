import secrets, string
from datetime import datetime, timedelta
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from django.core.exceptions import ObjectDoesNotExist
from apps.user.models import UserAccount

def ImageUploadTo(instance, filename):
    return f"uploads/files/{filename}"


class MiniLottery(models.Model):

    minilottery = models.CharField(_("ID"), max_length=128, unique=True, null=False, blank=False)
    prize = models.IntegerField(_("Acumulado"), default=500, null=False, blank=False, help_text="$Acumulado Valor (USD)")

    file = models.ImageField(_("Banner"), upload_to=ImageUploadTo, max_length=32, null=False, blank=False, 
            help_text="Width-(1440px) - Height-(600px)")

    mfile = models.ImageField(_("Mini-Banner"), upload_to=ImageUploadTo, max_length=32, null=False, blank=False, 
            help_text="Width-(760px) - Height-(640px)")
    
    tickets = models.SmallIntegerField (_("Tickets"), default=999, null=False, blank=False, help_text="#Tickets")
    price = models.IntegerField(_("Valor"), null=False, default=1, blank=False, help_text="$Ticket (USD)",
        validators=[MaxValueValidator(limit_value=100, message='Max. $100 USD')])
    
    winner = models.CharField (_("Ticket"), max_length=4, null=True, blank=True, help_text="#Ticket Ganador")

    date_minilottery = models.DateField(_("Fecha"), default=timezone.now)

    date_results = models.DateField(_("Fecha"), default=datetime(2000, 1, 1))
    stream = models.URLField(_("Link-Stream"), max_length=128, blank=True, null=True)
    amount = models.IntegerField(_("Total"), default=0, null=False, blank=False, help_text="$Total (USD)")

    sold = models.SmallIntegerField (_("Vendidos"), default=0, null=False, blank=False, help_text="#Tickets Totales")
    total = models.IntegerField(_("Total"), default=0, null=False, blank=False, help_text="$Total (USD)")

    is_active = models.BooleanField(_("¿Activo?"),default=True)

    def save(self, *args, **kwargs):
        try:
            last_id = MiniLottery.objects.latest('id').id
        except ObjectDoesNotExist:
            last_id = 0

        setToday = timezone.now()
        if setToday.day < 15:
            setToday = datetime(setToday.year, setToday.month, 15, tzinfo=timezone.get_current_timezone())
        else:
            nextMonth = setToday.replace(day=15) + timedelta(days=31)
            setToday = datetime(nextMonth.year, nextMonth.month, 15, tzinfo=timezone.get_current_timezone())

        if not self.minilottery:
            self.minilottery = "X0" + str(100 + last_id)
            self.date_minilottery = setToday
            self.date_results = datetime(2000, 1, 1)
        super(MiniLottery, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.minilottery}"

    class Meta:
        indexes = [models.Index(fields=['minilottery']),]
        verbose_name = _("MiniLoteria")
        verbose_name_plural = _("MiniLoteria")

class TicketsMiniLottery(models.Model):
    minilottery = models.ForeignKey(MiniLottery, on_delete=models.CASCADE)
    uuid = models.CharField(_("MiniLoteria"), max_length=32, null=True, blank=True)

    email = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    ticket = models.CharField (_("Ticket"),max_length=4, null=False, blank=False, help_text="#Ticket")
    date = models.DateField(_("Fecha"), default=timezone.now)

    voucher = models.CharField(_("Voucher"), max_length=128, null=False, blank=False)
    state = models.BooleanField(_("¿Estado?"),default=True)

    send = models.BooleanField(_("¿Enviado?"),default=False)

    def save(self, *args, **kwargs):
        self.uuid = self.minilottery.minilottery if self.minilottery else None
        super(TicketsMiniLottery, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.ticket}"

    class Meta:
        indexes = [models.Index(fields=['minilottery']),]
        verbose_name = _("Ticket")
        verbose_name_plural = _("Tickets")


class HistoryMiniLottery(models.Model):
    minilottery = models.CharField(_("ID"), max_length=128, unique=True, null=False, blank=False)

    winner = models.CharField (_("Ticket"), max_length=4, null=True, blank=True, help_text="#Ticket Ganador")

    price = models.IntegerField(_("Valor"), null=False, default=1, blank=False, help_text="$Ticket (USD)",
        validators=[MaxValueValidator(limit_value=100, message='Max. $100 USD')])
    sold = models.SmallIntegerField (_("Vendidos"), default=0, null=False, blank=False, help_text="#Tickets Totales")
    total = models.IntegerField(_("Total"), default=0, null=False, blank=False, help_text="$Total (USD)")

    stream = models.URLField(_("Link-Stream"), max_length=128, blank=True, null=True)
    date_results = models.DateField(_("Fecha"), default=timezone.now)
    is_active = models.BooleanField(_("¿Estado?"),default=False)

    def __str__(self):
        return f"{self.minilottery}"

    class Meta:
        verbose_name = _("Historial")
        verbose_name_plural = _("Hisotrial")