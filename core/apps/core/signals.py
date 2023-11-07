from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

import apps.core.models as models
import apps.core.serializers as serializers

@receiver(post_save, sender=models.ImagenSlider)
@receiver(post_delete, sender=models.ImagenSlider)
def handle_imagen_slider_change(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    queryset = models.ImagenSlider.objects.all()
    serializer = serializers.ImagenSliderSerializer(queryset, many=True)
    async_to_sync(channel_layer.group_send)(
        "imagen_slider_updates",
        {
            "type": "imagen_slider.update",
            "data": serializer.data,
        }
    )
