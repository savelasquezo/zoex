import os, requests, uuid
import hashlib

from django.utils import timezone
from django.conf import settings

from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from .models import UserAccount, Invoice, Withdrawals, Fee
from .serializers import UserSerializer, InvoiceSerializer, WithdrawalSerializer, FeeSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

from apps.core.models import Core
from apps.core.functions import xlsxSave, xlsxData

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
    "notifyUrl": "https://zoexbet.com/app/user/notify-invoice-confirmo/",
    "returnUrl": "https://zoexbet.com/",
    "reference": "Zoexbet"
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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Withdrawals.objects.filter(account=self.request.user).order_by("-id")

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if queryset:
            serialized_data = self.serializer_class(queryset, many=True).data
            for item in serialized_data:
                item['type'] = "Withdraw"
            return Response(serialized_data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'NotFound Withdrawals.'}, status=status.HTTP_404_NOT_FOUND)

class fetchInvoices(generics.ListAPIView):

    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Invoice.objects.filter(account=self.request.user).order_by("-id")

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if queryset:
            serialized_data = self.serializer_class(queryset, many=True).data
            for item in serialized_data:
                item['type'] = "Invoice"
            return Response(serialized_data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'NotFound Invoices.'}, status=status.HTTP_404_NOT_FOUND)


class fetchInvoiceRefered(generics.ListAPIView):
    serializer_class = FeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self, account):
        return Fee.objects.filter(account=account).order_by("-id")

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset(request.user)
            serialized_data = self.serializer_class(queryset, many=True).data
            return Response(serialized_data)
        
        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchInvoiceRefered {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'detail': 'NotFound Account.'}, status=status.HTTP_404_NOT_FOUND)


class requestWithdraw(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):

        user = request.user
        amount = int(request.data.get('amount', 0))
        method = user.billing
        
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

            apiWithdraw = str(uuid.uuid4())[:12]
            obj.voucher = apiWithdraw
            obj.save()

            xlsxSave(user.username, "Withdraw", -amount, currentBalance, newBalance, 0, 0, apiWithdraw, method)
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
                    if currentStatus == "paid":
                        obj.state = "done"
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
            obj = Invoice.objects.create(account=request.user,state='pending', defaults=data)
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
            user = request.user

            frame = str(request.data.get('frame', ''))
            location = str(request.data.get('location', ''))
            billing = str(request.data.get('billing', ''))

            user.frame = frame if frame != "" else user.frame
            user.location = location if location !="" else user.location
            user.billing = billing if billing !="" else user.billing
            user.save()

            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("updateAccountInfo {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'error': 'NotFound Account.'}, status=status.HTTP_404_NOT_FOUND)



class notifyInvoiceConfirmo(generics.GenericAPIView):

    serializer_class = InvoiceSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:

            payment_status = str(request.data.get('status', ''))
            reference_id = str(request.data.get('id', ''))

            invoice = Invoice.objects.get(voucher=reference_id)

            if invoice.method != "crypto":
                return Response({'error': 'NotFound Invoice.'}, status=status.HTTP_404_NOT_FOUND)

            if payment_status == "error" or payment_status == "expired":
                invoice.state = "error"
                invoice.save()

            if payment_status == "paid":
                headers = {'Content-Type': 'application/json',
                            'Authorization': f'Bearer {CONFIRMO}'}
                response = requests.get(f'https://payments.api.bold.co/v2/payment-voucher/{reference_id}', headers=headers)
                currentStatus = response.json().get('status') if response.status_code == 200 else "pending"
                if currentStatus == "paid":
                    invoice.state = "done"
                    invoice.save()

            return Response({'detail': 'Invoice state has been update!'}, status=status.HTTP_200_OK)

        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("notifyInvoiceBold {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'error': 'NotFound Invoice.'}, status=status.HTTP_404_NOT_FOUND)


class notifyInvoiceBold(generics.GenericAPIView):

    serializer_class = InvoiceSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            payment_status = str(request.data.get('payment_status', ''))
            reference_id = str(request.data.get('reference_id', ''))

            invoice = Invoice.objects.get(voucher=reference_id)
            if invoice.method != "bold":
                return Response({'error': 'NotFound Invoice.'}, status=status.HTTP_404_NOT_FOUND)

            if payment_status == "FAILED" or payment_status == "REJECTED":
                invoice.state = "error"
                invoice.save()

            if payment_status == "APPROVED":
                headers = {'Content-Type': 'application/json',
                            'Authorization': f'x-api-key {BOLD_PUBLIC_KEY}'}
                response = requests.get(f'https://payments.api.bold.co/v2/payment-voucher/{reference_id}', headers=headers)
                currentStatus = response.json().get('payment_status') if response.status_code == 200 else "pending"
                if currentStatus == "APPROVED":
                    invoice.state = "done"
                    invoice.save()

            return Response({'detail': 'Invoices state has been update!'}, status=status.HTTP_200_OK)

        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("notifyInvoiceBold {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'error': 'NotFound Invoice.'}, status=status.HTTP_404_NOT_FOUND)