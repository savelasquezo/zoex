"""core URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

urlpatterns = [
    path("app/admin/", admin.site.urls),
    path("app/auth/", include("djoser.urls")),
    path("app/auth/", include("djoser.urls.jwt")),
    path("app/auth/", include("djoser.social.urls")),
    path("app/user/", include("apps.user.urls")),
    path("app/core/", include("apps.core.urls")),
    path("app/lottery/", include("apps.lottery.urls")),
    path("app/minilottery/", include("apps.minilottery.urls")),
    path("app/giveaway/", include("apps.giveaway.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
