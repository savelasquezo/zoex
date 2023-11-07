from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import UserAccount


class UserAccountAdmin(BaseUserAdmin):
    list_display = ('username', 'email','phone')
    search_fields = ('username', 'email')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información personal', {'fields': ('username','phone')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2','phone'),
        }),
    )

    list_filter=[]

admin.site.register(UserAccount, UserAccountAdmin)