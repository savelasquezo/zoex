from django.apps import AppConfig


class MinilotteryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.minilottery'
    verbose_name = 'MiniLoteria'

    def ready(self):
        from . import signals

