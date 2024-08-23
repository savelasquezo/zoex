import os, uuid, base64
from io import BytesIO

from django.conf import settings
from django.utils import timezone
from django.http import HttpResponse

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework import status
from rest_framework.response import Response

from PIL import Image, ImageDraw, ImageFont

from .models import MiniLottery, TicketsMiniLottery, HistoryMiniLottery
from .serializers import MiniLotterySerializer, TicketsMiniLotterySerializer, HistoryMiniLotterySerializer

from apps.user.models import UserAccount
from apps.core.functions import xlsxSave, sendEmailTicket


class fetchMiniLottery(generics.GenericAPIView):
    """
    Endpoint to retrieve details of the currently active lottery.
    Requires no authentication.
    """
    serializer_class = MiniLotterySerializer

    def get(self, request, *args, **kwargs):
        try: 
            queryset = MiniLottery.objects.latest('id')
            serializer = self.get_serializer(queryset)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchMiniLottery {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'detail': 'NotFound MiniLottery.'}, status=status.HTTP_404_NOT_FOUND)
   


class requestTicketMiniLottery(generics.GenericAPIView):
    """
    Endpoint to request and purchase a MiniLottery ticket.
    Allows users to purchase a ticket for the current MiniLottery.
    """
    serializer_class = TicketsMiniLotterySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            ticket = request.data.get('ticket', '')
            apiVoucher = str(uuid.uuid4())[:8]
            data = {'email':user, 'ticket':ticket, 'voucher':apiVoucher}
            
            minilottery = MiniLottery.objects.get(is_active=True)
            if TicketsMiniLottery.objects.filter(minilottery=minilottery,ticket=ticket).first() is not None:
                return Response({'error': 'The ticket has already been purchased!'}, status=status.HTTP_400_BAD_REQUEST)

            ticket_price = minilottery.price
            if user.balance < ticket_price and user.credits < ticket_price:
                return Response({'error': 'The balance/credits are insufficient!'}, status=status.HTTP_400_BAD_REQUEST)

            elif user.credits >= ticket_price:
                currentCredits = user.credits
                user.credits -= ticket_price
                user.save()

                newCredits = user.credits
                xlsxSave(user.username, "Buy", ticket_price, 0, 0, currentCredits, newCredits, apiVoucher, "MiniLottery")

            elif user.balance >= ticket_price:
                currentBalance = user.balance
                user.balance -= ticket_price
                user.save()

                newBalance = user.balance
                xlsxSave(user.username, "Buy", ticket_price, currentBalance, newBalance, 0, 0, apiVoucher, "MiniLottery")
            
            obj = TicketsMiniLottery.objects.create(minilottery=minilottery,**data)
            return Response({'apiVoucher': apiVoucher}, status=status.HTTP_200_OK)
        
        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("requestTicketMiniLottery {} --> Error: {}\n".format(date, str(e)))
            return Response({'error': 'NotFound MiniLottery.'}, status=status.HTTP_404_NOT_FOUND)
        

class fetchTicketsMiniLottery(generics.ListAPIView):
    """
    Endpoint to retrieve a list of lottery tickets purchased by the authenticated user.
    Requires authentication.
    """
    serializer_class = TicketsMiniLotterySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = UserAccount.objects.get(email=self.request.user.email)
        minilottery = MiniLottery.objects.get(is_active=True)
        return TicketsMiniLottery.objects.filter(minilottery=minilottery, email=user)

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serialized_data = self.serializer_class(queryset, many=True).data
            for item in serialized_data:
                item['minilotteryID'] = MiniLottery.objects.get(is_active=True).minilottery
            return Response(serialized_data)
        
        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchTicketsMiniLottery {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'error': 'NotFound MiniLottery.'}, status=status.HTTP_404_NOT_FOUND)
        
class fetchAllTicketsMiniLottery(generics.ListAPIView):
    """
    Endpoint to retrieve a list of MiniLottery tickets purchased by the authenticated user.
    Requires authentication.
    """
    serializer_class = TicketsMiniLotterySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return TicketsMiniLottery.objects.filter(email=self.request.user).order_by("-id")

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serialized_data = self.serializer_class(queryset, many=True).data
            serialized_data = sorted(serialized_data, key=lambda x: x['id'], reverse=True)
            
            for obj in serialized_data:
                obj['is_active'] = MiniLottery.objects.get(id=obj['minilottery']).is_active
            return Response(serialized_data)
        
        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchAllTicketsMiniLottery {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'error': 'NotFound Any-MiniLottery.'}, status=status.HTTP_404_NOT_FOUND)

class fetchHistoryMiniLottery(generics.ListAPIView):
    """
    Endpoint to retrieve a list of history lottery by the any user.
    Requires no authentication.
    """
    serializer_class = HistoryMiniLotterySerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        return HistoryMiniLottery.objects.all().order_by("-id")

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serialized_data = self.serializer_class(queryset, many=True).data
            return Response(serialized_data)
        
        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchHistoryMiniLottery {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'error': 'NotFound List MiniLottery.'}, status=status.HTTP_404_NOT_FOUND)


class makeTicketMiniLottery(generics.GenericAPIView):
    
    def get(self, request, *args, **kwargs):
        try:
            voucher = request.GET.get('voucher')
            rsize = request.GET.get('rsize')

            rsize = True if rsize == "true" else False

            objTicket = TicketsMiniLottery.objects.get(voucher=voucher)
            ticket = objTicket.ticket
            obj = MiniLottery.objects.get(is_active=True)
            url = obj.mfile.url if rsize else obj.file.url

            absoluteURL = os.path.join(str(settings.MEDIA_BASE) + url)
            image = Image.open(absoluteURL)
            if image.mode != 'RGB':
                image = image.convert('RGB')
            draw = ImageDraw.Draw(image)

            pndX = 110 if rsize else 80
            pndY = 150 if rsize else 20

            boxX1, boxY1 = image.size[0]-pndX, image.size[1]-pndY
            boxWX, boxHX = boxX1//2, boxY1//8
            boxX0, boxY0 = boxX1 - boxWX, boxY1 - boxHX
            draw.rounded_rectangle([(boxX0, boxY0), (boxX1, boxY1)], radius=1, fill='white', outline='blue')

            font = ImageFont.truetype("DejaVuSans-Bold.ttf", 48)
            text = f"Ticket #{ticket}"
            txtW, txtH = draw.textsize(text, font=font)
            txtX, txtY = boxX1 - boxWX + (boxWX - txtW) // 2, boxY1 - boxHX + (boxHX - txtH) // 2
            draw.text((txtX, txtY), text, fill='black', font=font)

            image_buffer = BytesIO()
            image.save(image_buffer, format='JPEG')
            image_buffer.seek(0)

            requestImage = image_buffer.getvalue()
            if rsize and not objTicket.send:
                emailTicket = obj.prize
                image64 = base64.b64encode(requestImage).decode('utf-8')
                sendEmailTicket('email/ticket.html',f'MiniLoteria {emailTicket}-USD - Ticket!', request.user.email, image64, voucher)

                objTicket.send = True
                objTicket.save()

            return HttpResponse(requestImage, content_type='image/jpeg')
        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchHistoryMiniLottery {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'error': 'NotFound List MiniLottery.'}, status=status.HTTP_404_NOT_FOUND)