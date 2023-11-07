from django.db import models
from django.utils.translation import gettext_lazy as _

def ImageUploadTo(instance, id):
    return f"uploads/banner/{id}"

class Core(models.Model):
    default = models.CharField(_("ZoeXConfig"), max_length=32, blank=True, null=True, default="ZoeXConfig")
    stream = models.URLField(_("Link-Stream"), max_length=128, blank=True, null=True)

    idx = models.SmallIntegerField(_("Indicativo"), blank=True, null=True, default=57)
    phone = models.CharField(_("Telefono"), max_length=64, blank=True, null=True)
    
    email = models.EmailField(_("Correo"), max_length=254, blank=True, null=True)
    address = models.CharField(_("Address"), max_length=64, blank=True, null=True)

    twitter = models.URLField(_("Twitter"), max_length=128, blank=True, null=True)
    facebook = models.URLField(_("Facebook"), max_length=128, blank=True, null=True)
    linkedin = models.URLField(_("Linkedin"), max_length=128, blank=True, null=True)

    def __str__(self):
        return f"{self.default}"

    class Meta:
        verbose_name = _("Configuracion")
        verbose_name_plural = _("Configuracion")

class ImagenSlider(models.Model):

    settings = models.ForeignKey(Core, on_delete=models.CASCADE)
    file = models.ImageField(_("Imagen"), upload_to=ImageUploadTo, max_length=32, null=True, blank=True,
                                help_text="width-(1360px) - height-(320px)")

    def __str__(self):
        return f"{self.id}"

    class Meta:
        verbose_name = _("Imagen")
        verbose_name_plural = _("Imagenes")