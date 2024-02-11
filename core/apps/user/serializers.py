from djoser.serializers import PasswordResetConfirmSerializer
from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

from apps.user.models import UserAccount, Invoice, Withdrawals, Fee

User = get_user_model()

class UserSerializer(UserCreateSerializer):
    bonus = serializers.SerializerMethodField()
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ["id","uuid","referred","email","username","phone","balance","credits","location","billing","frame","bonus"]

    def get_bonus(self, obj):
        has_invoice = Invoice.objects.filter(account=obj).exists()
        return has_invoice

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'

class WithdrawalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Withdrawals
        fields = '__all__'


class FeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fee
        fields = ["username","fee","date"]

class CustomPasswordResetConfirmSerializer(PasswordResetConfirmSerializer):
    def build_password_reset_confirm_url(self, uid, token):
        url = f"?forgot_password_confirm=True&uid={uid}&token={token}"
        return url
