from rest_framework import generics
from . import models, serializers

class fechImagesSlider(generics.ListAPIView):
    queryset = models.ImagenSlider.objects.all()
    serializer_class = serializers.ImagenSliderSerializer
