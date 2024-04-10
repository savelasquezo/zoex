from rest_framework import serializers
from apps.minilottery.models import MiniLottery, TicketsMiniLottery, HistoryMiniLottery

class MiniLotterySerializer(serializers.ModelSerializer):

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
        model = MiniLottery
        fields = '__all__'

class TicketsMiniLotterySerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketsMiniLottery
        fields = '__all__'

class HistoryMiniLotterySerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryMiniLottery
        fields = '__all__'