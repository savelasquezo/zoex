import os, uuid
from django.conf import settings
from django.utils import timezone

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework import status
from rest_framework.response import Response

from . import models, serializers


class fetchLottery(generics.GenericAPIView):
    """
    Endpoint to retrieve details of the currently active lottery.
    Requires no authentication.
    """
    serializer_class = serializers.LotterySerializer
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        try: 
            queryset = models.Lottery.objects.get(is_active=True)
            serializer = self.get_serializer(queryset)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/django.log'), 'a') as f:
                f.write("fetchLottery {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'detail': 'NotFound Lottery.'}, status=status.HTTP_404_NOT_FOUND)


class requestTicketLottery(generics.GenericAPIView):
    """
    Endpoint to request and purchase a lottery ticket.
    Allows users to purchase a ticket for the current lottery by providing necessary information.
    """
    serializer_class = serializers.TicketsLotterySerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):

        email = str(request.data.get('email', ''))
        paymentMethod = str(request.data.get('paymentMethod', ''))
        ticket = str(request.data.get('ticket', ''))
        apiVoucher = str(uuid.uuid4())[:8]

        data = {'email':email, 'method':paymentMethod, 'ticket':ticket, 'voucher':apiVoucher}

        try:
            lottery = models.Lottery.objects.get(is_active=True)
            if models.TicketsLottery.objects.filter(lottery=lottery,ticket=ticket).first() is not None:
                return Response({'detail': 'The ticket has already been purchased!'}, status=status.HTTP_400_BAD_REQUEST)

            obj = models.TicketsLottery.objects.create(lottery=lottery,**data) 
            return Response({'apiVoucher': apiVoucher}, status=status.HTTP_200_OK)
        
        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/django.log'), 'a') as f:
                f.write("requestTicketLottery {} --> Error: {}\n".format(date, str(e)))
            return Response({'detail': 'NotFound Lottery.'}, status=status.HTTP_404_NOT_FOUND)
        

class fetchTicketsLottery(generics.ListAPIView):
    """
    Endpoint to retrieve a list of lottery tickets purchased by the authenticated user.
    Requires authentication.
    """
    serializer_class = serializers.TicketsLotterySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        lottery = models.Lottery.objects.get(is_active=True)
        return models.TicketsLottery.objects.filter(lottery=lottery, email=self.request.user.email)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serialized_data = self.serializer_class(queryset, many=True).data
        for item in serialized_data:
            item['lotteryID'] = models.Lottery.objects.get(is_active=True).lottery
        return Response(serialized_data)

class fetchHistoryLottery(generics.ListAPIView):
    """
    Endpoint to retrieve a list of history lottery by the any user.
    Requires no authentication.
    """
    serializer_class = serializers.HistoryLotterySerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        return models.HistoryLottery.objects.all().order_by("-id")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serialized_data = self.serializer_class(queryset, many=True).data
        return Response(serialized_data)