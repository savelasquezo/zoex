from rest_framework import serializers
import apps.core.models as models
from django.conf import settings

class CoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Core
        fields = '__all__'

class ImagenSliderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ImagenSlider
        fields = '__all__'


    ## def get_file(self, obj):
    ##    if obj.file:
    ##        # Obtén la URL absoluta
    ##        absolute_url = obj.file.url
    ##        # Convierte la URL absoluta a relativa
    ##        relative_url = absolute_url.replace(settings.MEDIA_URL, '')
    ##        return relative_url
    ##    return None