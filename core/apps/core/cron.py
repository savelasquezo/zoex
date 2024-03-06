"""cron Configuration
Install django-crontab and add 'django_cron' to INSTALLED_APPS
The `cronjobs` list needs to add config to settings.py:
    CRON_CLASSES = [
        "apps.core.cron.UpdateCurrency",
    ]
before add cronjobs clases add the crontask to crontab
$ crontab -e
> 0 */12 * * * /app/zoex/core/venv/bin/python /app/zoex/core/manage.py runcrons
"""
import os, requests
from django.conf import settings
from django.utils import timezone

from django_cron import CronJobBase, Schedule
from apps.core.models import Core

APILAYER_KEY = settings.APILAYER_KEY

class UpdateCurrency(CronJobBase):
    RUN_EVERY_MINS = 720
    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)

    code = 'apps.core.cron.UpdateCurrency'

    def do(self):
        setting = Core.objects.get(default="ZoeXConfig")
        try:
            url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                latestBTC=data["bitcoin"]["usd"]
                setting.latestBTC = latestBTC
                setting.save()

        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("CronBTC {} --> Error: {}\n".format(eDate, str(e)))

        try:
            url = "https://api.apilayer.com/fixer/latest?base=USD&symbols=COP"
            headers = {
                'apikey': f'{APILAYER_KEY}'
            }
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                latestUSD=data["rates"]["COP"]
                setting.latestUSD = latestUSD
                setting.save()

        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("CronUSD {} --> Error: {}\n".format(eDate, str(e)))     