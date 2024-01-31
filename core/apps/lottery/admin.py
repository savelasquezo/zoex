from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.conf.locale.es import formats as es_formats
from django.contrib import messages

from .models import Lottery, TicketsLottery
from apps.user.models import UserAccount

class TicketsLotteryInline(admin.StackedInline):
    
    model = TicketsLottery
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('state','uuid','ticket','email'),
            ('date','voucher'),
                )
            }
        ),
    )

    def get_readonly_fields(self, request, obj=None):
        return ['uuid','email','ticket','date','voucher']

    def has_add_permission(self, request, obj=None):
        return False

class LotteryAdmin(admin.ModelAdmin):

    list_display = (
        'lottery',
        'sold',
        'tickets',
        'price',
        'date_lottery',
        'winner',
        'is_active'
        )
    
    fieldsets = (
        ("Info", {"fields": 
            (('date_lottery','winner','is_active'),)
            }
        ),
        ("Informacion", {"fields": 
            (('prize','file'),
             ('price','tickets'),)
            }
        ),
        (" ", {"fields": 
            (('sold','amount','total'),
             ('date_results','stream'),)
            }
        ),
    )

    readonly_fields=['lottery',]
    es_formats.DATETIME_FORMAT = "d M Y"
    
    def get_readonly_fields(self, request, obj=None):
        if obj and obj.id:
            return ['lottery','prize','price','tickets','sold','amount','date_results','stream','total']
        return []

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        self.inlines = [TicketsLotteryInline]
        if not obj:
            fieldsets = [fieldsets[1]]
            self.inlines = []
        return fieldsets

    def has_add_permission(self, request):
         return False if Lottery.objects.filter(is_active=True).exists() else True

    def save_model(self, request, obj, form, change):
        getWinner = TicketsLottery.objects.filter(lottery=obj,ticket=obj.winner, state=True)
        if getWinner.exists():
            username = UserAccount.objects.get(email=getWinner.first().email).username
            messages.warning(request, f'¡Advertencia! ¡El Usuario {username} ha Ganado!')

        super(LotteryAdmin, self).save_model(request, obj, form, change)


admin.site.register(Lottery, LotteryAdmin)
