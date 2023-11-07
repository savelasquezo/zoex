from rest_framework import generics
from django.http import JsonResponse


import apps.giveaway.models as models
import apps.giveaway.serializers as serializers

class fechGiveaway(generics.ListAPIView):
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
            giveaway_data['progress'] = round((ticket_count/total_tickets)*100,2)
            serialized_data.append(giveaway_data)

        return JsonResponse({"data": serialized_data})