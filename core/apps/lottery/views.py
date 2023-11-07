from rest_framework_api.views import StandardAPIView
from . import models, serializers


class fechLottery(StandardAPIView):
    queryset = models.Lottery.objects.filter(is_active=True).first()
    serializer_class = serializers.LotterySerializer


