from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.conf.locale.es import formats as es_formats

import apps.giveaway.models as model

class TicketsGiveawayInline(admin.StackedInline):
    model = model.TicketsGiveaway
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('is_active','ticket','email'),
            ('date','voucher'),
                )
            }
        ),
    )

    def get_readonly_fields(self, request, obj=None):
        return ['email','ticket','date','voucher']

class GiveawayAdmin(admin.ModelAdmin):

    inlines = [TicketsGiveawayInline]
    
    list_display = (
        "giveaway",
        "prize",
        "value",
        "tickets",
        "price",
        "date_giveaway",
        )

    fieldsets = (
        ("Info", {"fields": (
                    ("winner","date_giveaway","is_active"),
                ),
            }
        ),
        ("Informacion", {"fields": 
            (("prize","file"),
             ("price","tickets"),)
            }
        ),
        (" ", {"fields": 
            (("sold","amount"),
             ("date_results","stream"),)
            }
        ),
    )

    readonly_fields=['giveaway',]
    es_formats.DATETIME_FORMAT = "d M Y"
    
    def get_readonly_fields(self, request, obj=None):
        if obj and obj.id:
            return ["giveaway","prize","price","tickets","sold","amount","date_results","stream"]
        return []

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        self.inlines = [TicketsGiveawayInline]
        if not obj:
            fieldsets = [fieldsets[1]]
            self.inlines = []
        return fieldsets

admin.site.register(model.Giveaway, GiveawayAdmin)