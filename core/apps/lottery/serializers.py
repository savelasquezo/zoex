from rest_framework import serializers
import apps.lottery.models as models

class LotterySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Lottery
        fields = '__all__'
