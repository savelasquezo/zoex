#!/bin/bash
DJANGODIR=$(dirname $(cd `dirname $0` && pwd))
DJANGO_SETTINGS_MODULE=core.settings
cd $DJANGODIR
source /app/zoex/core/venv/bin/activate
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
exec python3 manage.py runserver 217.196.63.210:8000
