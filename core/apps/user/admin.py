from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.conf.locale.es import formats as es_formats

import apps.user.models as models

class FeesAccountInline(admin.StackedInline):
    
    model = models.Fee
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('invoice','username'),
            ('date','fee'),
                )
            }
        ),
    )

    readonly_fields = ('invoice','username','date','fee')
    def has_add_permission(self, request, obj=None):
        return False

class FeesInvoiceInline(admin.StackedInline):
    
    model = models.Fee
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('account','username'),
            ('date','fee'),
                )
            }
        ),
    )

    readonly_fields = ('invoice','username','date','fee')
    def has_add_permission(self, request, obj=None):
        return False

class WithdrawalsInline(admin.StackedInline):
    
    model = models.Withdrawals
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('method','state'),
            ('amount','date','voucher'),
                )
            }
        ),
    )

    radio_fields = {'state': admin.HORIZONTAL}
    readonly_fields = ('method','amount','date','voucher')
    def has_add_permission(self, request, obj=None):
        return False

class InvoiceInline(admin.StackedInline):
    
    model = models.Invoice
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('method','state'),
            ('amount','date','voucher'),
                )
            }
        ),
    )

    radio_fields = {'state': admin.HORIZONTAL}
    readonly_fields = ('method','amount','date','state','voucher')
    def has_add_permission(self, request, obj=None):
        return False


class InvoiceAdmin(admin.ModelAdmin):
    list_display = (
        'voucher',
        'account',
        'amount',
        'date',
        'state'
        )

    list_filter = ['date','state']
    search_fields = ['voucher']

    radio_fields = {'state': admin.HORIZONTAL}
    es_formats.DATETIME_FORMAT = "d M Y"
    
    fieldsets = (
        (None, {'fields': (
            ('account','method','state'),
            ('amount','date','voucher'),
        )}),
    )

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        self.inlines = [FeesInvoiceInline]
        return fieldsets

    readonly_fields=['account','method','amount','date','state','voucher']
    def has_add_permission(self, request):
         return False

class WithdrawalsAdmin(admin.ModelAdmin):
    list_display = (
        'voucher',
        'account',
        'amount',
        'date',
        'state'
        )

    list_filter = ['date','state']
    search_fields = ['voucher']

    radio_fields = {'state': admin.HORIZONTAL}
    es_formats.DATETIME_FORMAT = "d M Y"
    
    fieldsets = (
        (None, {'fields': (
            ('account','method','state'),
            ('amount','date','voucher'),
        )}),
    )

    readonly_fields=['account','uuid','method','amount','date','voucher']
    def has_add_permission(self, request):
         return False


class UserAccountAdmin(BaseUserAdmin):
    list_display = ('username', 'email','phone','balance')
    search_fields = ('username', 'email')

    fieldsets = (
        (None, {'fields': (('email','uuid','is_active','is_staff'), 'password')}),
            ('Información', {'fields': (
            ('username','phone','referred'),
            ('balance','credits'),
            ('location','billing'),
        )}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2','phone'),
        }),
    )

    list_filter=[]

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        self.inlines = [WithdrawalsInline, InvoiceInline,FeesAccountInline]
        return fieldsets

    def get_readonly_fields(self, request, obj=None):
        return ['username','email','uuid','phone','referred','balance','credits','location','billing']


admin.site.register(models.UserAccount, UserAccountAdmin)
admin.site.register(models.Invoice, InvoiceAdmin)
admin.site.register(models.Withdrawals, WithdrawalsAdmin)


