from django.apps import AppConfig


class LotteryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.lottery'
    verbose_name = 'Loteria'

    def ready(self):
        from . import signals