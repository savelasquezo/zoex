import os, uuid
from django.conf import settings
from django.utils import timezone

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework import status
from rest_framework.response import Response


from .models import Lottery, TicketsLottery, HistoryLottery
from .serializers import LotterySerializer, TicketsLotterySerializer, HistoryLotterySerializer

from apps.user.models import UserAccount


class fetchLottery(generics.GenericAPIView):
    """
    Endpoint to retrieve details of the currently active lottery.
    Requires no authentication.
    """
    serializer_class = LotterySerializer
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        try: 
            queryset = Lottery.objects.get(is_active=True)
            serializer = self.get_serializer(queryset)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchLottery {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'detail': 'NotFound Lottery.'}, status=status.HTTP_404_NOT_FOUND)


class requestTicketLottery(generics.GenericAPIView):
    """
    Endpoint to request and purchase a lottery ticket.
    Allows users to purchase a ticket for the current lottery.
    """
    serializer_class = TicketsLotterySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        email = str(request.data.get('email', ''))
        ticket = str(request.data.get('ticket', ''))
        apiVoucher = str(uuid.uuid4())[:8]

        data = {'email':email, 'ticket':ticket, 'voucher':apiVoucher}

        try:
            user = UserAccount.objects.get(email=email) 
            lottery = Lottery.objects.get(is_active=True)
            if TicketsLottery.objects.filter(lottery=lottery,ticket=ticket).first() is not None:
                return Response({'error': 'The ticket has already been purchased!'}, status=status.HTTP_400_BAD_REQUEST)

            if user.balance < lottery.price and user.credits < lottery.price:
                return Response({'error': 'The balance/credits are insufficient!'}, status=status.HTTP_400_BAD_REQUEST)

            elif user.credits >= lottery.price:
                user.credits -= lottery.price
                user.save()

            elif user.balance >= lottery.price:
                user.balance -= lottery.price
                user.save()
            
            obj = TicketsLottery.objects.create(lottery=lottery,**data) 
            return Response({'apiVoucher': apiVoucher}, status=status.HTTP_200_OK)
        
        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("requestTicketLottery {} --> Error: {}\n".format(date, str(e)))
            return Response({'error': 'NotFound Lottery.'}, status=status.HTTP_404_NOT_FOUND)
        

class fetchTicketsLottery(generics.ListAPIView):
    """
    Endpoint to retrieve a list of lottery tickets purchased by the authenticated user.
    Requires authentication.
    """
    serializer_class = TicketsLotterySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        lottery = Lottery.objects.get(is_active=True)
        return TicketsLottery.objects.filter(lottery=lottery, email=self.request.user.email)

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serialized_data = self.serializer_class(queryset, many=True).data
            for item in serialized_data:
                item['lotteryID'] = Lottery.objects.get(is_active=True).lottery
            return Response(serialized_data)
        
        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchTicketsLottery {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'error': 'NotFound Lottery.'}, status=status.HTTP_404_NOT_FOUND)

class fetchHistoryLottery(generics.ListAPIView):
    """
    Endpoint to retrieve a list of history lottery by the any user.
    Requires no authentication.
    """
    serializer_class = HistoryLotterySerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        return HistoryLottery.objects.all().order_by("-id")

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serialized_data = self.serializer_class(queryset, many=True).data
            return Response(serialized_data)
        
        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchHistoryLottery {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'error': 'NotFound Lottery.'}, status=status.HTTP_404_NOT_FOUND)