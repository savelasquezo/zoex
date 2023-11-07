from django.apps import AppConfig


class GiveawayConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.giveaway'

    def ready(self):
        from . import signals