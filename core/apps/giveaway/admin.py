from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.conf.locale.es import formats as es_formats
from django.contrib import messages

from .models import Giveaway, TicketsGiveaway
from apps.user.models import UserAccount

class TicketsGiveawayInline(admin.StackedInline):
    model = TicketsGiveaway
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('uuid','ticket','email'),
            ('date','voucher'),
                )
            }
        ),
    )

    def get_readonly_fields(self, request, obj=None):
        return ['uuid','email','ticket','date','voucher']

    def has_add_permission(self, request, obj=None):
        return False

    #def has_delete_permission(self, request, obj=None):
    #    return False

class GiveawayAdmin(admin.ModelAdmin):

    inlines = [TicketsGiveawayInline]
    
    list_display = (
        "giveaway",
        "prize",
        "sold",
        "amount",
        "price",
        "date_giveaway",
        'is_active'
        )

    fieldsets = (
        ("Info", {"fields": (
                    ("winner","date_giveaway","is_active"),
                ),
            }
        ),
        ("Informacion", {"fields": 
            (("file","mfile"),
             ("prize","price","tickets"),)
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

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        getWinner = TicketsGiveaway.objects.filter(giveaway=obj, ticket=obj.winner, state=True)

        if getWinner.exists():
            username = UserAccount.objects.get(email=getWinner.first().email).username
            messages.warning(request, f'¡Advertencia! ¡El Usuario {username} ha Ganado!')
        else:
            messages.success(request, f'¡El Sorteo no ha seleccionado ningun ganador!')

admin.site.register(Giveaway, GiveawayAdmin)