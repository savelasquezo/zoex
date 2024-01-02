from rest_framework import serializers
import apps.lottery.models as models

class LotterySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Lottery
        fields = '__all__'

class TicketsLotterySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TicketsLottery
        fields = '__all__'

class HistoryLotterySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.HistoryLottery
        fields = '__all__'