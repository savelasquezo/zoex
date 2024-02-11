import os, uuid
from django.conf import settings
from django.utils import timezone

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework import status
from rest_framework.response import Response


from .models import Lottery, TicketsLottery
from .serializers import LotterySerializer, TicketsLotterySerializer

from apps.user.models import UserAccount
from apps.core.functions import xlsxSave


class fetchLottery(generics.GenericAPIView):
    """
    Endpoint to retrieve details of the currently active lottery.
    Requires no authentication.
    """
    serializer_class = LotterySerializer

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
        try:
            user = request.user
            ticket = request.data.get('ticket', '')
            apiVoucher = str(uuid.uuid4())[:8]
            data = {'email':user, 'ticket':ticket, 'voucher':apiVoucher}
            
            lottery = Lottery.objects.get(is_active=True)
            if TicketsLottery.objects.filter(lottery=lottery,ticket=ticket).first() is not None:
                return Response({'error': 'The ticket has already been purchased!'}, status=status.HTTP_400_BAD_REQUEST)

            ticket_price = lottery.price
            if user.balance < ticket_price and user.credits < ticket_price:
                return Response({'error': 'The balance/credits are insufficient!'}, status=status.HTTP_400_BAD_REQUEST)

            elif user.credits >= ticket_price:
                currentCredits = user.credits
                user.credits -= ticket_price
                user.save()

                newCredits = user.credits
                xlsxSave(user.username, "Buy", ticket_price, 0, 0, currentCredits, newCredits, apiVoucher, "Lottery")

            elif user.balance >= ticket_price:
                currentBalance = user.balance
                user.balance -= ticket_price
                user.save()

                newBalance = user.balance
                xlsxSave(user.username, "Buy", ticket_price, currentBalance, newBalance, 0, 0, apiVoucher, "Lottery")
            
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
        user = UserAccount.objects.get(email=self.request.user.email)
        lottery = Lottery.objects.get(is_active=True)
        return TicketsLottery.objects.filter(lottery=lottery, email=user)

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
        
class fetchAllTicketsLottery(generics.ListAPIView):
    """
    Endpoint to retrieve a list of lottery tickets purchased by the authenticated user.
    Requires authentication.
    """
    serializer_class = TicketsLotterySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = UserAccount.objects.get(email=self.request.user.email)
        return TicketsLottery.objects.filter(email=user).order_by("-id")

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serialized_data = self.serializer_class(queryset, many=True).data
            serialized_data = sorted(serialized_data, key=lambda x: x['id'], reverse=True)
            
            for obj in serialized_data:
                obj['is_active'] = Lottery.objects.get(id=obj['lottery']).is_active
            return Response(serialized_data)
        
        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchAllTicketsLottery {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'error': 'NotFound Any-Lottery.'}, status=status.HTTP_404_NOT_FOUND)

class fetchHistoryLottery(generics.ListAPIView):
    """
    Endpoint to retrieve a list of history lottery by the any user.
    Requires no authentication.
    """
    serializer_class = LotterySerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        return Lottery.objects.filter(is_active=False).order_by("-id")

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serialized_data = self.serializer_class(queryset, many=True).data
            return Response(serialized_data)
        
        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchHistoryLottery {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'error': 'NotFound List Lottery.'}, status=status.HTTP_404_NOT_FOUND)