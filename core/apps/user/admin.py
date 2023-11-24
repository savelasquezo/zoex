from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import UserAccount


class UserAccountAdmin(BaseUserAdmin):
    list_display = ('username', 'email','phone','balance')
    search_fields = ('username', 'email')

    fieldsets = (
        (None, {'fields': (('email','uuid','is_active','is_verified','is_staff'), 'password')}),
        ('Información personal', {'fields': (
            ('username','phone'),
            ('balance','referred'),
        )}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2','phone'),
        }),
    )

    list_filter=[]

    def get_readonly_fields(self, request, obj=None):
        return ['username','email','uuid','phone','balance','referred']

admin.site.register(UserAccount, UserAccountAdmin)