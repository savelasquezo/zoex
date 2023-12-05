from django.contrib import admin
from django.utils.translation import gettext_lazy as _

import apps.core.models as model

from rest_framework_simplejwt.token_blacklist.admin import OutstandingTokenAdmin
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken


class CustomOutstandingTokenAdmin(OutstandingTokenAdmin):
    def has_delete_permission(self, *args, **kwargs):
        return True

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
        ("idx","phone"),
        ("email","address"),
        )}

    fSocial = {"fields": (
        "twitter",
        "facebook",
        "instagram",
        )}

    fieldsets = (
        ("Configuracion", fConfig),
        ("Social", fSocial),
        )

    def has_add_permission(self, request):
         return False if model.Core.objects.exists() else True

    readonly_fields=['default',]


admin.site.unregister(OutstandingToken)

admin.site.register(model.Core, CoreAdmin)
admin.site.register(OutstandingToken, CustomOutstandingTokenAdmin)