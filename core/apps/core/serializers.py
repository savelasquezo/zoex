from rest_framework import serializers
import apps.core.models as models

class CoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Core
        fields = '__all__'

class ImagenSliderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ImagenSlider
        fields = '__all__'

