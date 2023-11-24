from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.conf.locale.es import formats as es_formats

import apps.lottery.models as models


class TicketsLotteryInline(admin.StackedInline):
    
    model = models.TicketsLottery
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ("email","ticket"),
            ("date","voucher"),
                )
            }
        ),
    )



class LotteryAdmin(admin.ModelAdmin):

    list_display = (
        "lottery",
        "prize",
        "tickets",
        "price",
        "date_lottery",
        "is_active"
        )
    
    fieldsets = (
        ("Info", {"fields": 
            (("date_lottery","winner","is_active"),)
            }
        ),
        ("Informacion", {"fields": 
            (("prize","banner"),
             ("price","tickets"),)
            }
        ),
        (" ", {"fields": 
            (("sold","ammount"),
             ("date_results","stream"),)
            }
        ),
    )

    readonly_fields=['lottery',]
    es_formats.DATETIME_FORMAT = "d M Y"
    
    def get_readonly_fields(self, request, obj=None):
        if obj and obj.id:
            return ["lottery","prize","price","tickets","sold","ammount","date_results","stream"]
        return []

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        self.inlines = [TicketsLotteryInline]
        if not obj:
            fieldsets = [fieldsets[1]]
            self.inlines = []
        return fieldsets

    def has_add_permission(self, request):
         return False if models.Lottery.objects.filter(is_active=True).exists() else True


admin.site.register(models.Lottery, LotteryAdmin)