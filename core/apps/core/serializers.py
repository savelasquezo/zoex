from rest_framework import serializers
import apps.core.models as models


class CoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Core
        fields = '__all__'

class ImagenSliderSerializer(serializers.ModelSerializer):
    
    file = serializers.SerializerMethodField()
    def get_file(self, obj):
        if obj.file:
            return obj.file.url.lstrip('')
        return None

    class Meta:
        model = models.ImagenSlider
        fields = '__all__'


