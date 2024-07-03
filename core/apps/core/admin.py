from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import Group
import apps.core.models as model

from rest_framework_simplejwt.token_blacklist.admin import OutstandingTokenAdmin
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken


class MyAdminSite(admin.AdminSite):
    index_title = 'Consola Administrativa'
    verbose_name = "ZoeX"


admin_site = MyAdminSite()
admin.site = admin_site
admin_site.site_header = "ZoeX"


class ImagenSliderInline(admin.StackedInline):
    
    model = model.ImagenSlider
    extra = 0
    fieldsets = ((" ", {"fields": (("file",),)}),)

class CoreAdmin(admin.ModelAdmin):

    inlines = [ImagenSliderInline]
    
    list_display = (
        "default",
        "hashtag",
        "email",
        "phone",
        "address",
        )

    fConfig = {"fields": (
        ("stream","hashtag"),
        ("idx","phone","video"),
        ("email","address"),
        ("bonusPercent","referredPercent"),
        "terms"
        )}

    fSocial = {"fields": (
        "twitter",
        "facebook",
        "instagram"
        )}

    fieldsets = (
        ("Configuracion", fConfig),
        ("Social", fSocial),
        )

    def has_delete_permission(self, request, obj=None):
        return False
    
    def has_add_permission(self, request):
        return False if model.Core.objects.exists() else True

    readonly_fields=['default',]

admin.site.register(Group)
admin.site.register(model.Core, CoreAdmin)
