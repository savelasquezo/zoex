import os, uuid
from django.conf import settings
from django.utils import timezone

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework import status
from rest_framework.response import Response

from .models import Giveaway, TicketsGiveaway
from .serializers import GiveawaySerializer, TicketsGiveawaySerializer

from apps.user.models import UserAccount

class fetchGiveaway(generics.ListAPIView):
    """
    Endpoint to retrieve details of the currently active giveaways.
    Requires no authentication.
    """
    serializer_class = GiveawaySerializer
    permission_classes = [AllowAny]

    def get_queryset(self, request):
        queryset = Giveaway.objects.filter(is_active=True)
        return queryset

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset(request)
            serialized_data = []

            for obj in queryset:
                total_tickets = Giveaway.objects.get(id=obj.id).tickets
                ticket_count = TicketsGiveaway.objects.filter(giveaway=obj).count()
                giveaway_data = GiveawaySerializer(obj).data
                giveaway_data['progress'] = round(100-(ticket_count/(total_tickets+1))*100, 2)

                """Fix Relative URL---> Absolute URL"""
                if giveaway_data['banner']:
                    giveaway_data['banner'] = request.build_absolute_uri(giveaway_data['banner'])

                serialized_data.append(giveaway_data)

            return Response(serialized_data, status=status.HTTP_200_OK)
        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchGiveaway {} --> Error: {}\n".format(date, str(e)))
            return Response({'error': 'NotFound Giveaway.'}, status=status.HTTP_404_NOT_FOUND)

class requestTicketGiveaway(generics.GenericAPIView):
    """
    Endpoint to request and purchase a Giveaway ticket.
    Allows users to purchase a ticket for the current lottery by providing necessary information.
    """
    serializer_class = TicketsGiveawaySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        email = str(request.data.get('email', ''))
        ticket = str(request.data.get('ticket', ''))
        giveawayID = str(request.data.get('giveawayId', ''))
        apiVoucher = str(uuid.uuid4())[:8]

        data = {'email':email, 'ticket':ticket, 'voucher':apiVoucher}

        try:
            user = UserAccount.objects.get(email=email) 
            giveaway = Giveaway.objects.get(id=giveawayID)
            if TicketsGiveaway.objects.filter(giveaway=giveaway,ticket=ticket).first() is not None:
                return Response({'error': 'The ticket has already been purchased!'}, status=status.HTTP_400_BAD_REQUEST)

            if user.balance < giveaway.price and user.credits < giveaway.price:
                return Response({'error': 'The balance/credits are insufficient!'}, status=status.HTTP_400_BAD_REQUEST)

            elif user.credits >= giveaway.price:
                user.credits -= giveaway.price
                user.save()

            elif user.balance >= giveaway.price:
                user.balance -= giveaway.price
                user.save()

            obj = TicketsGiveaway.objects.create(giveaway=giveaway,**data) 
            return Response({'apiVoucher': apiVoucher}, status=status.HTTP_200_OK)

        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("requestTicketGiveaway {} --> Error: {}\n".format(date, str(e)))
            return Response({'error': 'NotFound Giveaway.'}, status=status.HTTP_404_NOT_FOUND)

class fetchTicketsGiveaway(generics.ListAPIView):
    """
    Endpoint to retrieve a list of giveaway tickets purchased by the authenticated user.
    Requires authentication.
    """
    serializer_class = TicketsGiveawaySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self, request):
        giveawayId = self.kwargs.get('giveawayId')
        return TicketsGiveaway.objects.filter(email=self.request.user.email, giveaway=giveawayId)

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset(request)
            serialized_data = self.serializer_class(queryset, many=True).data
            return Response(serialized_data)
        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchTicketsGiveaway {} --> Error: {}\n".format(date, str(e)))
            return Response({'error': 'NotFound Giveaway.'}, status=status.HTTP_404_NOT_FOUND)
