import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

def LogoUploadTo(instance, filename):
    return f"uploads/{instance.username}/logo/{filename}"

states = (('pending','Pendiente'),('done','Aprobado'),('error','Error'))
methods = (('crypto','Cryptomonedas'),('bold','Bold'))

class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('¡Email Obligatorio!')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)


class UserAccount(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True, primary_key=True)
    uuid = models.CharField(_("Codigo"),max_length=8)
    referred = models.CharField(_("Ref"),max_length=8)
    email = models.EmailField(_("Email"),unique=True)
    username = models.CharField(_("Usuario"),max_length=64, unique=True)
    phone = models.CharField(_("Telefono"),max_length=64, unique=True, null=False, blank=False)
    location = models.CharField(_("Ubicacion"),max_length=256, null=True, blank=True)
    billing = models.CharField(_("Facturacion"),max_length=256, null=True, blank=True)
    date_joined = models.DateField(_("Fecha"),default=timezone.now)
    last_joined = models.DateField(_("Ultimo Ingreso"),default=timezone.now)
    balance = models.FloatField(_("Saldo"),default=0, null=True, blank=True, help_text="Saldo Disponible $USD")
    credits = models.FloatField(_("Creditos"),default=0, null=True, blank=True, help_text="Saldo Promocional $USD")

    frame = models.CharField(_("Avatar"),default=0,max_length=2, null=True, blank=True)

    is_active = models.BooleanField(_("¿Activo?"),default=True)
    is_staff = models.BooleanField(_("¿Staff?"),default=False)
    is_verified = models.BooleanField(_("¿Verificado?"),default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username','phone','referred']

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.email}"

    class Meta:
        indexes = [models.Index(fields=['email']),]
        verbose_name = _("Usuario")
        verbose_name_plural = _("Usuarios")

class Withdrawals(models.Model):
    account = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    uuid = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True)
    amount = models.FloatField(_("Volumen"),blank=False,null=False,default=0,
        help_text=_("Volumen de Capital Solicitado (USD)"),)
    date = models.DateField(_("Fecha"), default=timezone.now)
    method = models.CharField(_("Metodo"), choices=methods, max_length=128, null=False, blank=False)
    voucher = models.CharField(_("Voucher"), max_length=128, null=False, blank=False)
    state = models.CharField(_("¿Estado?"), choices=states, default="pending", max_length=16)

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id}"

    class Meta:
        indexes = [models.Index(fields=['state']),]
        verbose_name = _("Retiro")
        verbose_name_plural = _("Retiros")

class Invoice(models.Model):
    account = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    uuid = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True)
    amount = models.FloatField(_("Volumen"),blank=False,null=False,default=0,
        help_text=_("Volumen de Capital Solicitado (USD)"),)
    date = models.DateField(_("Fecha"), default=timezone.now)
    method = models.CharField(_("Metodo"), choices=methods, max_length=128, null=False, blank=False)
    voucher = models.CharField(_("Voucher"), max_length=128, null=False, blank=False)
    state = models.CharField(_("¿Estado?"), choices=states, default="pending", max_length=16)

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id}"

    class Meta:
        indexes = [models.Index(fields=['state']),]
        verbose_name = _("Recarga")
        verbose_name_plural = _("Recargas")



class Fee(models.Model):
    account = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    username = models.CharField(_("Usuario"),max_length=64)
    fee = models.FloatField(_("Valor"), null=True, blank=True, help_text="Comisión $USD") 
    date = models.DateField(_("Fecha"), default=timezone.now)

    def __str__(self):
        return f"{self.id}"

    class Meta:
        indexes = [models.Index(fields=['account']),]
        verbose_name = _("Comicion")
        verbose_name_plural = _("Comiciones")
