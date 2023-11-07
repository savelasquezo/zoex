from rest_framework import serializers
import apps.giveaway.models as models

class GiveawaySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Giveaway
        fields = '__all__'

class TicketsGiveawaySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TicketsGiveaway
        fields = '__all__'
