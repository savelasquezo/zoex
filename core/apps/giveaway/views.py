from django.http import JsonResponse

from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

import apps.giveaway.models as models
import apps.giveaway.serializers as serializers

class fetchGiveaway(generics.ListAPIView):
    serializer_class = serializers.GiveawaySerializer

    def get_queryset(self):
        return models.Giveaway.objects.filter(is_active=True)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serialized_data = []

        for giveaway in queryset:
            total_tickets = models.Giveaway.objects.get(id=giveaway.id).tickets
            ticket_count = models.TicketsGiveaway.objects.filter(giveaway=giveaway).count()
            giveaway_data = serializers.GiveawaySerializer(giveaway).data
            giveaway_data['progress'] = round(100-(ticket_count/total_tickets)*100, 2)

            """Fix Relative URL---> Absolute URL"""
            if giveaway_data['banner']:
                giveaway_data['banner'] = request.build_absolute_uri(giveaway_data['banner'])

            serialized_data.append(giveaway_data)

        return JsonResponse(serialized_data, safe=False)

class fetchTicketsGiveaway(generics.ListAPIView):
    serializer_class = serializers.TicketsGiveawaySerializer

    def get_queryset(self):
        return models.TicketsGiveaway.objects.filter(email="email@email.com")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serialized_data = self.serializer_class(queryset, many=True).data
        return Response(serialized_data)
