from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.safestring import mark_safe
from django_ckeditor_5.fields import CKEditor5Field

def ImageUploadTo(instance, id):
    return f"uploads/files/{id}"

def FilesUploadTo(instance, id):
    return f"uploads/items/{id}"

class Core(models.Model):
    default = models.CharField(_("ZoeXConfig"), max_length=32, unique=True, blank=True, null=True, default="ZoeXConfig")
    stream = models.URLField(_("Link-Stream"), max_length=128, blank=True, null=True)
    hashtag = models.CharField(_("Hashtag"), max_length=16, blank=True, null=True, default="zoexbet")

    idx = models.SmallIntegerField(_("Indicativo"), blank=True, null=True, default=57)
    phone = models.CharField(_("Telefono"), max_length=64, blank=True, null=True)
    
    email = models.EmailField(_("Correo"), max_length=254, blank=True, null=True)
    address = models.CharField(_("Address"), max_length=64, blank=True, null=True)

    twitter = models.URLField(_("Twitter"), max_length=256, blank=True, null=True)
    facebook = models.URLField(_("Facebook"), max_length=256, blank=True, null=True)
    instagram = models.URLField(_("Instagram"), max_length=256, blank=True, null=True)

    video = models.URLField(_("MediaFile"), max_length=256, blank=True, null=True)

    bonusPercent = models.FloatField(_("%Bonificacion"),default=15, null=True, blank=True, 
        help_text="Porcentaje Adicional en la Primera Recarga (%) ")
    
    referredPercent = models.FloatField(_("%Referidos"),default=5, null=True, blank=True,
        help_text="Porcentaje Beneficio en Referidos (%)")
    
    latestUSD = models.FloatField(_("USD->COP"),default=4000, null=True, blank=True)
    latestBTC = models.FloatField(_("BTC->USD"),default=50000, null=True, blank=True)
    
    terms = CKEditor5Field(_("Terminos & Condiciones"), config_name='extends')

    def __str__(self):
        return f"{self.default}"

    class Meta:
        verbose_name = _("Configuracion")
        verbose_name_plural = _("Configuracion")

class ImagenSlider(models.Model):

    settings = models.ForeignKey(Core, on_delete=models.CASCADE)
    file = models.ImageField(_("Imagen"), upload_to=ImageUploadTo, max_length=32, null=True, blank=True,
                                help_text="Width-(1340px) - Height-(500px)")

    def __str__(self):
        return f"{self.id}"

    class Meta:
        verbose_name = _("Imagen")
        verbose_name_plural = _("Imagenes")