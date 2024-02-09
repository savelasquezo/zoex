import os
from django.conf import settings

from django.core.mail import send_mail, BadHeaderError
from django.template.loader import render_to_string
from asgiref.sync import sync_to_async
from django.utils import timezone

from rest_framework import generics, status
from rest_framework.response import Response

from . import models, serializers

class fetchInfo(generics.GenericAPIView):
    serializer_class = serializers.CoreSerializer
    def get(self, request, *args, **kwargs):
        try:
            queryset = models.Core.objects.get(default="ZoeXConfig")
            serializer = self.get_serializer(queryset)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'detail': 'NotFound ZoeXConfig.'}, status=status.HTTP_404_NOT_FOUND)


class fetchImagesSlider(generics.ListAPIView):
    queryset = models.ImagenSlider.objects.all()
    serializer_class = serializers.ImagenSliderSerializer

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
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            subject = request.data.get('subject', None)
            email_template_name = "email/message.html"
            c = {
                "eDate": eDate,
                "email": request.data.get('email', None),
                "message": request.data.get('message', None),
            }
            email = render_to_string(email_template_name, c)
            try:
                send_mail(subject, message=None, from_email='message@zoexbet.com',
                          recipient_list=['noreply@zoexbet.com'], fail_silently=False, html_message=email)
                return Response({'detail': 'Email Enviado.'}, status=status.HTTP_200_OK)
            except BadHeaderError:
                with open(os.path.join(settings.BASE_DIR, 'logs/email.log'), 'a') as f:
                    f.write("EmailError {} --> Error: {}\n".format(eDate, str(e)))
                return Response({'error': 'NotFound Email'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            with open(os.path.join(settings.BASE_DIR, 'logs/email.log'), 'a') as f:
                f.write("EmailError {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'error': 'Unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)