from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.conf.locale.es import formats as es_formats
from django.contrib import messages

from .models import MiniLottery, TicketsMiniLottery
from apps.user.models import UserAccount

class TicketsMiniLotteryInline(admin.StackedInline):
    
    model = TicketsMiniLottery
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('uuid','ticket','email'),
            ('date','voucher','state'),
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

class MiniLotteryAdmin(admin.ModelAdmin):

    list_display = (
        'minilottery',
        'sold',
        'tickets',
        'price',
        'date_minilottery',
        'winner',
        'is_active'
        )
    
    fieldsets = (
        ("Info", {"fields": 
            (('date_minilottery','winner','is_active'),)
            }
        ),
        ("Informacion", {"fields": 
            (('file','mfile'),
             ('prize','price','tickets'),)
            }
        ),
        (" ", {"fields": 
            (('sold','amount','total'),
             ('date_results','stream'),)
            }
        ),
    )

    readonly_fields=['minilottery',]
    es_formats.DATETIME_FORMAT = "d M Y"
    
    def get_readonly_fields(self, request, obj=None):
        if obj and obj.id:
            return ['minilottery','prize','price','tickets','sold','amount','date_results','stream','total']
        return []

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        self.inlines = [TicketsMiniLotteryInline]
        if not obj:
            fieldsets = [fieldsets[1]]
            self.inlines = []
        return fieldsets

    def has_add_permission(self, request):
        return False if MiniLottery.objects.filter(is_active=True).exists() else True

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        getWinner = TicketsMiniLottery.objects.filter(minilottery=obj,ticket=obj.winner)
        if getWinner.exists():
            username = UserAccount.objects.get(email=getWinner.first().email).username
            messages.warning(request, f'¡Advertencia! ¡El Usuario {username} ha Ganado!')

admin.site.register(MiniLottery, MiniLotteryAdmin)
