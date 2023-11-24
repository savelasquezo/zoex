import secrets, string
from datetime import datetime, timedelta

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from django.core.exceptions import ObjectDoesNotExist

def ImageUploadTo(instance, id):
    return f"uploads/banner/{id}"

class Giveaway(models.Model):

    giveaway = models.CharField(_("ID"), max_length=128, unique=True, null=False, blank=False)

    prize = models.CharField(_("Objeto"), max_length=128, null=False, blank=False)
    value = models.IntegerField(_("$Valor Estimado"), default=1000, null=False, blank=False, help_text="$Valor (USD)")

    banner = models.ImageField(_("Imagen"), upload_to=ImageUploadTo, max_length=32, null=False, blank=False,
                    help_text="Dimenciones: width:1240px height:550px")
    
    tickets = models.SmallIntegerField (_("Tickets"), default=999, null=False, blank=False, help_text="#Tickets Totales")
    price = models.SmallIntegerField(_("Valor"), null=False, blank=False, help_text="$Ticket (USD)")
    
    winner = models.SmallIntegerField (_("Ticket"), null=True, blank=True, help_text="#Ticket Ganador")

    date_giveaway = models.DateField(_("Fecha"), default=timezone.now)

    sold = models.SmallIntegerField (_("Tickets"), default=0, null=False, blank=False, help_text="#Tickets Totales")
    date_results = models.DateField(_("Fecha"), default=timezone.now)
    stream = models.URLField(_("Link-Stream"), max_length=128, blank=True, null=True)
    ammount = models.IntegerField(_("Total"), default=0, null=False, blank=False, help_text="$Total (USD)")

    is_active = models.BooleanField(_("¿Activo?"),default=True)

    def save(self, *args, **kwargs):
        try:
            last_id = Giveaway.objects.latest('id').id
        except ObjectDoesNotExist:
            last_id = 0

        setToday = timezone.now()
        if setToday.day < 15:
            setToday = datetime(setToday.year, setToday.month, 15, tzinfo=timezone.get_current_timezone())
        else:
            nextMonth = setToday.replace(day=15) + timedelta(days=31)
            setToday = datetime(nextMonth.year, nextMonth.month, 15, tzinfo=timezone.get_current_timezone())

        if not self.giveaway:
            self.giveaway = "I0" + str(100 + last_id)
            self.date_giveaway = setToday
            self.date_results = datetime(2000, 1, 1)
        super(Giveaway, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.giveaway}"

    class Meta:
        verbose_name = _("Sorteo")
        verbose_name_plural = _("Sorteos")



class TicketsGiveaway(models.Model):
    giveaway = models.ForeignKey(Giveaway, on_delete=models.CASCADE)
    email = models.EmailField(_("Email"), unique=False, null=False, blank=False)
    ticket = models.CharField (_("Ticket"),max_length=4, null=False, blank=False, help_text="#Ticket")
    date = models.DateField(_("Fecha"), default=timezone.now)

    voucher = models.CharField(_("Voucher"), max_length=128, null=False, blank=False)

    def __str__(self):
        return f"{self.ticket}"

    class Meta:
        verbose_name = _("Ticket")
        verbose_name_plural = _("Tickets")