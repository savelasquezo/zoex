from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

import apps.giveaway.models as models
import apps.giveaway.serializers as serializers

@receiver(post_save, sender=models.TicketsGiveaway)
@receiver(post_delete, sender=models.TicketsGiveaway)
def signalTicketsGiveaway(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    queryset = models.TicketsGiveaway.objects.all()
    serializer = serializers.TicketsGiveawaySerializer(queryset, many=True)
    async_to_sync(channel_layer.group_send)(
        "groupTicketsGiveaway",
        {
            "type": "asyncTicketsGiveaway",
            "data": serializer.data,
        }
    )
