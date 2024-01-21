import os, uuid
from django.conf import settings
from django.utils import timezone

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework import status
from rest_framework.response import Response

from . import models, serializers


class fetchGiveaway(generics.ListAPIView):
    """
    Endpoint to retrieve details of the currently active giveaways.
    Requires no authentication.
    """
    serializer_class = serializers.GiveawaySerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        queryset = models.Giveaway.objects.filter(is_active=True)
        serialized_data = []

        for giveaway in queryset:
            total_tickets = models.Giveaway.objects.get(id=giveaway.id).tickets
            ticket_count = models.TicketsGiveaway.objects.filter(giveaway=giveaway).count()
            giveaway_data = serializers.GiveawaySerializer(giveaway).data
            giveaway_data['progress'] = round(100-(ticket_count/(total_tickets+1))*100, 2)

            """Fix Relative URL---> Absolute URL"""
            if giveaway_data['banner']:
                giveaway_data['banner'] = request.build_absolute_uri(giveaway_data['banner'])

            serialized_data.append(giveaway_data)

        return Response(serialized_data, status=status.HTTP_200_OK)

class requestTicketGiveaway(generics.GenericAPIView):
    """
    Endpoint to request and purchase a Giveaway ticket.
    Allows users to purchase a ticket for the current lottery by providing necessary information.
    """
    serializer_class = serializers.TicketsGiveawaySerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):

        email = str(request.data.get('email', ''))
        ticket = str(request.data.get('ticket', ''))
        giveawayID = str(request.data.get('giveawayId', ''))
        apiVoucher = str(uuid.uuid4())[:8]

        data = {'email':email, 'ticket':ticket, 'voucher':apiVoucher}

        try:
            ##Agregar verificacion y resta de saldo, priorizando creditos a balance

            giveaway = models.Giveaway.objects.get(id=giveawayID)
            if models.TicketsGiveaway.objects.filter(giveaway=giveaway,ticket=ticket).first() is not None:
                return Response({'detail': 'The ticket has already been purchased!'}, status=status.HTTP_400_BAD_REQUEST)

            obj = models.TicketsGiveaway.objects.create(giveaway=giveaway,**data) 
            return Response({'apiVoucher': apiVoucher}, status=status.HTTP_200_OK)

        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/django.log'), 'a') as f:
                f.write("requestTicketGiveaway {} --> Error: {}\n".format(date, str(e)))
            return Response({'detail': 'NotFound Giveaway.'}, status=status.HTTP_404_NOT_FOUND)

class fetchTicketsGiveaway(generics.ListAPIView):
    """
    Endpoint to retrieve a list of giveaway tickets purchased by the authenticated user.
    Requires authentication.
    """
    serializer_class = serializers.TicketsGiveawaySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self, request):
        giveawayId = self.kwargs.get('giveawayId')
        return models.TicketsGiveaway.objects.filter(email=self.request.user.email, giveaway=giveawayId)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset(request)
        serialized_data = self.serializer_class(queryset, many=True).data
        return Response(serialized_data)
