import os, uuid, base64
from io import BytesIO

from django.conf import settings
from django.utils import timezone

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework import status
from rest_framework.response import Response

from PIL import Image, ImageDraw, ImageFont
from django.http import HttpResponse

from .models import Giveaway, TicketsGiveaway
from .serializers import GiveawaySerializer, TicketsGiveawaySerializer

from apps.user.models import UserAccount
from apps.core.functions import xlsxSave, sendEmailTicket

class fetchGiveaway(generics.ListAPIView):
    """
    Endpoint to retrieve details of the currently active giveaways.
    Requires no authentication.
    """
    serializer_class = GiveawaySerializer
    permission_classes = [AllowAny]

    def get_queryset(self, request):
        queryset = Giveaway.objects.filter(is_active=True)
        return queryset

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset(request)
            serialized_data = []

            for obj in queryset:
                total_tickets = Giveaway.objects.get(id=obj.id).tickets
                ticket_count = TicketsGiveaway.objects.filter(giveaway=obj).count()
                giveaway_data = GiveawaySerializer(obj).data
                giveaway_data['progress'] = round(100-(ticket_count/(total_tickets+1))*100, 2)
                serialized_data.append(giveaway_data)

            return Response(serialized_data, status=status.HTTP_200_OK)
        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchGiveaway {} --> Error: {}\n".format(date, str(e)))
            return Response({'error': 'NotFound Giveaway.'}, status=status.HTTP_404_NOT_FOUND)

class requestTicketGiveaway(generics.GenericAPIView):
    """
    Endpoint to request and purchase a Giveaway ticket.
    Allows users to purchase a ticket for the current lottery by providing necessary information.
    """
    serializer_class = TicketsGiveawaySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        try:
            user = request.user
            ticket = request.data.get('ticket', '')
            giveawayID = request.data.get('giveawayId', '')
            apiVoucher = str(uuid.uuid4())[:8]
            data = {'email':user, 'ticket':ticket, 'voucher':apiVoucher}

            giveaway = Giveaway.objects.get(id=giveawayID)
            if TicketsGiveaway.objects.filter(giveaway=giveaway,ticket=ticket).first() is not None:
                return Response({'error': 'The ticket has already been purchased!'}, status=status.HTTP_400_BAD_REQUEST)
            
            ticket_price = giveaway.price
            if user.balance < ticket_price and user.credits < ticket_price:
                return Response({'error': 'The balance/credits are insufficient!'}, status=status.HTTP_400_BAD_REQUEST)

            elif user.credits >= ticket_price:
                currentCredits = user.credits
                user.credits -= ticket_price
                user.save()

                newCredits = user.credits
                xlsxSave(user.username, "Buy", ticket_price, 0, 0, currentCredits, newCredits, apiVoucher, "Giveaway")

            elif user.balance >= ticket_price:
                currentBalance = user.balance
                user.balance -= ticket_price
                user.save()

                newBalance = user.balance
                xlsxSave(user.username, "Buy", ticket_price, currentBalance, newBalance, 0, 0, apiVoucher, "Giveaway")

            obj = TicketsGiveaway.objects.create(giveaway=giveaway,**data) 
            return Response({'apiVoucher': apiVoucher}, status=status.HTTP_200_OK)

        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("requestTicketGiveaway {} --> Error: {}\n".format(date, str(e)))
            return Response({'error': 'NotFound Giveaway.'}, status=status.HTTP_404_NOT_FOUND)

class fetchTicketsGiveaway(generics.ListAPIView):
    """
    Endpoint to retrieve a list of giveaway tickets purchased by the authenticated user.
    Requires authentication.
    """
    serializer_class = TicketsGiveawaySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self, request, giveawayId):
        user = UserAccount.objects.get(email=self.request.user.email)
        return TicketsGiveaway.objects.filter(email=user, giveaway=giveawayId)

    def get(self, request, *args, **kwargs):
        try:
            giveawayId = self.kwargs.get('giveawayId')
            queryset = self.get_queryset(request, giveawayId)
            serialized_data = self.serializer_class(queryset, many=True).data
            for item in serialized_data:
                item['giveawayID'] = Giveaway.objects.get(id=giveawayId).giveaway
            return Response(serialized_data)
        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchTicketsGiveaway {} --> Error: {}\n".format(date, str(e)))
            return Response({'error': 'NotFound Giveaway.'}, status=status.HTTP_404_NOT_FOUND)


class fetchAllTicketsGiveaway(generics.ListAPIView):
    """
    Endpoint to retrieve a list of lottery tickets purchased by the authenticated user.
    Requires authentication.
    """
    serializer_class = TicketsGiveawaySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self, request):
        return TicketsGiveaway.objects.filter(email=request.user).order_by("-id")

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset(request)
            serialized_data = self.serializer_class(queryset, many=True).data
            serialized_data = sorted(serialized_data, key=lambda x: x['id'], reverse=True)

            for obj in serialized_data:
                obj['is_active'] = Giveaway.objects.get(id=obj['giveaway']).is_active
            return Response(serialized_data)
        
        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchAllTicketsGiveaway {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'error': 'NotFound Any-Lottery.'}, status=status.HTTP_404_NOT_FOUND)



class makeTicketGiveaway(generics.GenericAPIView):
    
    def get(self, request, *args, **kwargs):
        giveawayId = request.GET.get('giveawayId')
        voucher = request.GET.get('voucher')
        rsize = request.GET.get('rsize')

        rsize = True if rsize == "true" else False

        objTicket = TicketsGiveaway.objects.get(voucher=voucher)
        ticket = objTicket.ticket
        obj = Giveaway.objects.get(id=giveawayId)
        url = obj.mfile.url if rsize else obj.file.url

        image = Image.open(os.path.join(str(settings.BASE_DIR) + url))
        image = Image.open(os.path.join(str(settings.BASE_DIR) + url))
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
        text = f"{ticket} - {voucher}"
        txtW, txtH = draw.textsize(text, font=font)
        txtX, txtY = boxX1 - boxWX + (boxWX - txtW) // 2, boxY1 - boxHX + (boxHX - txtH) // 2
        draw.text((txtX, txtY), text, fill='black', font=font)

        image_buffer = BytesIO()
        image.save(image_buffer, format='JPEG')
        image_buffer.seek(0)

        requestImage = image_buffer.getvalue()

        if rsize =="False" and not objTicket.send:
            image64 = base64.b64encode(requestImage).decode('utf-8')
            sendEmailTicket('email/ticket.html',f'Sorteo {obj.giveaway} - Ticket!', request.user.email, image64)

            objTicket.send = True
            objTicket.save()

        return HttpResponse(requestImage, content_type='image/jpeg')