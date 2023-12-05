from djoser.serializers import PasswordResetConfirmSerializer
from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

import apps.user.models as models
User = get_user_model()

class UserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ["id","uuid","email","username","password","phone","balance","credits","is_staff"]

class WithdrawalSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Withdrawals
        fields = ["id","amount","date","voucher","state"]

class CustomPasswordResetConfirmSerializer(PasswordResetConfirmSerializer):
    def build_password_reset_confirm_url(self, uid, token):
        url = f"?forgot_password_confirm=True&uid={uid}&token={token}"
        return url
