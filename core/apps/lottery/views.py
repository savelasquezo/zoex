from django.http import JsonResponse

from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from . import models, serializers


class fetchLottery(generics.GenericAPIView):

    serializer_class = serializers.LotterySerializer
    def get(self, request, *args, **kwargs):
        queryset = models.Lottery.objects.get(is_active=True)
        if queryset:
            serializer = self.get_serializer(queryset)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'NotFound Lottery.'}, status=status.HTTP_404_NOT_FOUND)


class fetchTicketsLottery(generics.ListAPIView):
    serializer_class = serializers.TicketsLotterySerializer

    def get_queryset(self):
        return models.TicketsLottery.objects.filter(email=self.request.user.email)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serialized_data = self.serializer_class(queryset, many=True).data
        return Response(serialized_data)
