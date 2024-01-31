from rest_framework import serializers
import apps.lottery.models as models

class LotterySerializer(serializers.ModelSerializer):

    file = serializers.SerializerMethodField()
    def get_file(self, obj):
        if obj.file:
            return obj.file.url.lstrip('')
        return None

    class Meta:
        model = models.Lottery
        fields = '__all__'

class TicketsLotterySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TicketsLottery
        fields = '__all__'
