from rest_framework import serializers
from apps.lottery.models import Lottery, TicketsLottery, HistoryLottery

class LotterySerializer(serializers.ModelSerializer):

    file = serializers.SerializerMethodField()
    
    def get_file(self, obj):
        if obj.file:
            return obj.file.url.lstrip('')
        return None
    
    def get_mfile(self, obj):
        if obj.mfile:
            return obj.mfile.url.lstrip('')
        return None

    class Meta:
        model = Lottery
        fields = '__all__'

class TicketsLotterySerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketsLottery
        fields = '__all__'

class HistoryLotterySerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryLottery
        fields = '__all__'
