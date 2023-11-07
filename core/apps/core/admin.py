from django.contrib import admin
from django.utils.translation import gettext_lazy as _

import apps.core.models as model

class ImagenSliderInline(admin.StackedInline):
    
    model = model.ImagenSlider
    extra = 0
    fieldsets = ((" ", {"fields": (("file",),)}),)

class CoreAdmin(admin.ModelAdmin):

    inlines = [ImagenSliderInline]
    
    list_display = (
        "default",
        "email",
        "phone",
        "address",
        )

    fConfig = {"fields": (
        ("stream"),
        ("idx","phone"),
        ("email","address"),
        )}

    fSocial = {"fields": (
        "twitter",
        "facebook",
        "linkedin",
        )}

    fieldsets = (
        ("Configuracion", fConfig),
        ("Social", fSocial),
        )

    def has_add_permission(self, request):
         return False if model.Core.objects.exists() else True

    readonly_fields=['default',]

admin.site.register(model.Core, CoreAdmin)
