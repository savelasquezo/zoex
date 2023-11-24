import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

def LogoUploadTo(instance, filename):
    return f"uploads/{instance.username}/logo/{filename}"

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
    date_joined = models.DateField(_("Fecha"),default=timezone.now)
    last_joined = models.DateField(_("Ultimo Ingreso"),default=timezone.now)
    balance = models.IntegerField(_("Saldo"),default=0, null=True, blank=True)

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
