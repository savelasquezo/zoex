import os, requests, uuid
import hashlib

from django.utils import timezone
from django.conf import settings

from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from .models import Invoice, Withdrawals
from .serializers import UserSerializer, WithdrawalSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

from apps.core.models import Core
from apps.core.functions import xlsxSave

CONFIRMO = settings.CONFIRMO_KEY
BOLD_PUBLIC_KEY = settings.BOLD_PUBLIC_KEY
BOLD_SECRET_KEY = settings.BOLD_SECRET_KEY

def makeConfirmoInvoice(amount):
    body = {
    "product": {
        "description": "ZoexFund",
        "name": "TOPUP"
    },
    "invoice": {
        "amount": amount,
        "currencyFrom": "USD"
    },
    "settlement": {
        "currency": "USD"
    },
    "notifyEmail": "noreply@zoexbet.com",
    "notifyUrl": "https://zoexbet.com/",
    "returnUrl": "https://zoexbet.com/",
    "reference": "anything"
    }

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {CONFIRMO}'

    }
    response = requests.post('https://confirmo.net/api/v3/invoices', json=body, headers=headers)
    return response


def makeBoldInvoice(amount):
    body = {
    "product": {
        "description": "ZoeXbet",
        "name": "TOPUP"
    },
    "invoice": {
        "amount": amount,
        "currencyFrom": "USD"
    },
    "settlement": {
        "currency": "USD"
    },
    "notifyEmail": "noreply@zoexbet.com",
    "notifyUrl": "https://zoexbet.com/",
    "returnUrl": "https://zoexbet.com/",
    "reference": "anything"
    }

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {CONFIRMO}'

    }
    response = requests.post('https://confirmo.net/api/v3/invoices', json=body, headers=headers)
    return response


class fetchWithdrawals(generics.ListAPIView):
    serializer_class = WithdrawalSerializer

    def get_queryset(self):
        return Withdrawals.objects.filter(account=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if queryset:
            serialized_data = self.serializer_class(queryset, many=True).data
            return Response(serialized_data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'NotFound Lottery.'}, status=status.HTTP_404_NOT_FOUND)



class requestWithdraw(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):

        user = request.user
        amount = int(request.data.get('amount', 0))
        method = user.billing
        data = {'method':method,'amount':amount}
        
        if amount > user.balance or amount <= 0:
            return Response({'detail': 'The requested amount is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            obj, created = Withdrawals.objects.update_or_create(account=user,state='pending', method=method)
            obj.amount = amount if created else obj.amount + amount
            obj.method = method
            
            currentBalance = user.balance
            user.balance = currentBalance - amount
            user.save()

            newBalance = user.balance

            apiWithdraw = str(uuid.uuid4())[:8]
            obj.voucher = apiWithdraw
            obj.save()

            xlsxSave(user.username, "Withdraw", -amount, currentBalance, newBalance, "", "", apiWithdraw, method)
            return Response({'apiWithdraw': apiWithdraw, 'newBalance': newBalance}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'detail': 'NotFound Lottery.'}, status=status.HTTP_404_NOT_FOUND)


class refreshInvoices(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        try:
            account= request.user
            list_invoices_bold = Invoice.objects.filter(account=account,state="pending",method="bold")
            list_invoices_crypto = Invoice.objects.filter(account=account,state="pending",method="crypto")

            if list_invoices_crypto.exists():
                headers = {'Content-Type': 'application/json',
                            'Authorization': f'Bearer {CONFIRMO}'}
                
                for obj in list_invoices_crypto:
                    response = requests.get(f'https://confirmo.net/api/v3/invoices/{obj.voucher}', headers=headers)
                    currentStatus = response.json().get('status') if response.status_code == 200 else "pending"
                    if currentStatus == "done":
                        obj.state = currentStatus
                        obj.save()


            if list_invoices_bold.exists():
                headers = {'Content-Type': 'application/json',
                            'Authorization': f'x-api-key {BOLD_PUBLIC_KEY}'}
                
                for obj in list_invoices_crypto:
                    response = requests.get(f'https://payments.api.bold.co/v2/payment-voucher/{obj.voucher}', headers=headers)
                    currentStatus = response.json().get('payment_status') if response.status_code == 200 else "pending"
                    if currentStatus == "APPROVED":
                        obj.state = "done"
                        obj.save()

            return Response({'detail': 'Invoices Refresh!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': 'NotFound CryptoInvoices!'}, status=status.HTTP_404_NOT_FOUND)
        


class requestInvoice(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):

        method = str(request.data.get('method', ''))
        amount = int(request.data.get('amount', 0))

        data = {'method':method,'amount':amount}
    
        try:
            obj, created = Invoice.objects.update_or_create(account=request.user,state='pending',method=method, defaults=data)
            setting = Core.objects.get(default="ZoeXConfig")
            integritySignature = "N/A"

            if method == "crypto":
                response = makeConfirmoInvoice(amount)
                if response.status_code == 201:
                    apiInvoice = response.json().get('id')
                    copAmmount = int(amount*setting.latestUSD)
                
            if method == "bold":
                copAmmount = int(amount*setting.latestUSD)
                apiInvoice = str(uuid.uuid4())[:12]

                hash256 = "{}{}{}{}".format(apiInvoice,str(copAmmount),"COP",BOLD_SECRET_KEY)
                m = hashlib.sha256()
                m.update(hash256.encode())
                integritySignature = m.hexdigest()

            obj.voucher = apiInvoice
            obj.save()
            return Response({'apiInvoice': apiInvoice, 'integritySignature': integritySignature, 'copAmmount': copAmmount}, status=status.HTTP_200_OK)
        
        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("requestInvoice {} --> Error: {}\n".format(date, str(e)))
            return Response({'error': 'NotFound Invoice.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class updateAccountInfo(generics.GenericAPIView):

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            frame = str(request.data.get('frame', ''))
            location = str(request.data.get('location', ''))
            billing = str(request.data.get('billing', ''))

            user = request.user

            user.frame = frame
            user.location = location
            user.billing = billing
            user.save()

            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("updateAccountInfo {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'error': 'NotFound Account.'}, status=status.HTTP_404_NOT_FOUND)


        