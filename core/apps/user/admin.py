from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.conf.locale.es import formats as es_formats

import apps.user.models as models

class WithdrawalsInline(admin.StackedInline):
    
    model = models.Withdrawals
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            'uuid',
            ('method','state'),
            ('amount','date','voucher'),
                )
            }
        ),
    )

    radio_fields = {'state': admin.HORIZONTAL}
    readonly_fields = ('uuid','method','amount','date','voucher')
    def has_add_permission(self, request, obj=None):
        return False

class InvoiceInline(admin.StackedInline):
    
    model = models.Invoice
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            'uuid',
            ('method','state'),
            ('amount','date','voucher'),
                )
            }
        ),
    )

    radio_fields = {'state': admin.HORIZONTAL}
    readonly_fields = ('uuid','method','amount','date','voucher')
    def has_add_permission(self, request, obj=None):
        return False


class InvoiceAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'account',
        'amount',
        'date',
        'voucher',
        'state'
        )

    list_filter = ['date','state']
    search_fields = ['voucher']

    radio_fields = {'state': admin.HORIZONTAL}
    es_formats.DATETIME_FORMAT = "d M Y"
    
    fieldsets = (
        (None, {'fields': (('account','uuid'),('method','state'),)}),
            ('Información', {'fields': (
            ('amount','date','voucher'),
        )}),
    )

    readonly_fields=['account','uuid','method','amount','date']
    def has_add_permission(self, request):
         return False

class WithdrawalsAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'account',
        'amount',
        'date',
        'voucher',
        'state'
        )

    list_filter = ['date','state']
    search_fields = ['voucher']

    radio_fields = {'state': admin.HORIZONTAL}
    es_formats.DATETIME_FORMAT = "d M Y"
    
    fieldsets = (
        (None, {'fields': (('account','uuid'),('method','state'),)}),
            ('Información', {'fields': (
            ('amount','date','voucher'),
        )}),
    )

    readonly_fields=['account','uuid','method','amount','date']
    def has_add_permission(self, request):
         return False

class UserAccountAdmin(BaseUserAdmin):
    list_display = ('username', 'email','phone','balance')
    search_fields = ('username', 'email')

    fieldsets = (
        (None, {'fields': (('email','uuid','is_active','is_verified','is_staff'), 'password')}),
            ('Información', {'fields': (
            ('username','phone','referred'),
            ('balance','credits'),
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
        self.inlines = [WithdrawalsInline, InvoiceInline]
        return fieldsets

    def get_readonly_fields(self, request, obj=None):
        return ['username','email','uuid','phone','referred']


admin.site.register(models.UserAccount, UserAccountAdmin)
admin.site.register(models.Invoice, InvoiceAdmin)
admin.site.register(models.Withdrawals, WithdrawalsAdmin)

