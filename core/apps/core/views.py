import os
from django.conf import settings

from django.core.mail import send_mail, BadHeaderError
from django.template.loader import render_to_string
from asgiref.sync import sync_to_async
from django.utils import timezone

from rest_framework import generics, status
from rest_framework.response import Response

from . import models
from apps.core.serializers import CoreSerializer, ImagenSliderSerializer

class fetchInfo(generics.GenericAPIView):
    serializer_class = CoreSerializer
    def get(self, request, *args, **kwargs):
        try:
            queryset = models.Core.objects.get(default="ZoeXConfig")
            serializer = self.get_serializer(queryset)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'detail': 'NotFound ZoeXConfig.'}, status=status.HTTP_404_NOT_FOUND)


class fetchImagesSlider(generics.ListAPIView):
    queryset = models.ImagenSlider.objects.all()
    serializer_class = ImagenSliderSerializer

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'detail': 'NotFound ZoeXConfig.'}, status=status.HTTP_404_NOT_FOUND)  

class sendMessage(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        try:
            subject = request.data.get('subject')
            requestEmail = request.data.get('email', None),
            requestMessaje = request.data.get('message', None)

            email_template_name = 'email/message.html'

            print(f'{subject}{requestEmail}{requestMessaje}')

            c = {
                "send": requestEmail,
                "message": requestMessaje,
            }

            email = render_to_string(email_template_name, c)
            send_mail(subject, message=None, from_email='noreply@zoexbet.com',
                        recipient_list=['admin@zoexbet.com'], fail_silently=False, html_message=email)
            return Response({'detail': 'Email Enviado.'}, status=status.HTTP_200_OK)
            
        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("GET EmailError {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'error': 'Unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)