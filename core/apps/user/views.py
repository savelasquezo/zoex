import os, re, requests, uuid

from django.utils import timezone
from django.conf import settings

from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from openpyxl import Workbook
from openpyxl import load_workbook

from . import models, serializers
from ..core.models import Core


CONFIRMO = settings.CONFIRMO_KEY_TEST

def makeConfirmoInvoice(amount):
    body = {
    "product": {
        "description": "ZoexFund",
        "name": "topup"
    },
    "invoice": {
        "amount": amount,
        "currencyFrom": "USD"
    },
    "settlement": {
        "currency": "USD"
    },
    "notifyEmail": "noreply@zoexwin.com",
    "notifyUrl": "https://zoexwin.com/",
    "returnUrl": "https://zoexwin.com/",
    "reference": "anything"
    }

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {CONFIRMO}'

    }
    response = requests.post('https://confirmo.net/api/v3/invoices', json=body, headers=headers)
    return response

class fetchWithdrawals(generics.ListAPIView):
    serializer_class = serializers.WithdrawalSerializer

    def get_queryset(self):
        return models.Withdrawals.objects.filter(account=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if queryset:
            serialized_data = self.serializer_class(queryset, many=True).data
            return Response(serialized_data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'NotFound Lottery.'}, status=status.HTTP_404_NOT_FOUND)



class requestWithdraw(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):

        method = str(request.data.get('withdrawMethod', ''))
        amount = int(request.data.get('withdrawAmount', 0))

        data = {'method':method,'amount':amount}
        
        account = request.user
        if amount > account.balance or amount <= 0:
            return Response({'detail': 'The requested amount is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            obj, created = models.Withdrawals.objects.update_or_create(account=account,state='pending', method=method)
            obj.amount = amount if created else obj.amount + amount
            obj.method = method
            
            currentBalance = account.balance
            account.balance = currentBalance - amount
            account.save()

            newBalance = account.balance

            apiWithdraw = str(uuid.uuid4())[:8]
            obj.voucher = apiWithdraw
            obj.save()

            file = os.path.join(settings.BASE_DIR, 'logs', 'workbook', f'{account.username}.xlsx')
            try:
                date = timezone.now().strftime("%Y-%m-%d %H:%M")
                if not os.path.exists(file):
                    WB = Workbook()
                    WS = WB.active
                    WS.append(["Tipo","Fecha","Volumen","Actual","Final","Voucher","Metodo"])
                else:
                    WB = load_workbook(file)
                    WS = WB.active

                data = [1, date, amount, currentBalance, newBalance, apiWithdraw, method]
                print(data)

                WS.append(data)
                WB.save(file)
                
            except Exception as e:
                with open(os.path.join(settings.BASE_DIR, 'logs/workbook.log'), 'a') as f:
                    f.write("WorkbookError: {}\n".format(str(e)))

            return Response({'apiWithdraw': apiWithdraw, 'newBalance': newBalance}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'detail': 'NotFound Lottery.'}, status=status.HTTP_404_NOT_FOUND)


class refreshInvoices(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        try:
            account= request.user
            invoices = models.Invoice.objects.filter(account=account,state="pending",method="crypto")
            if invoices.exists():
                headers = {'Content-Type': 'application/json',
                            'Authorization': f'Bearer {CONFIRMO}'}
                
                for obj in invoices:
                    response = requests.get(f'https://confirmo.net/api/v3/invoices/{obj.voucher}', headers=headers)
                    currentStatus = response.json().get('status') if response.status_code == 200 else "error"
                    if currentStatus == "done":
                        account.balance = account.balance + obj.amount
                        accourtReferred = models.UserAccount.objects.filter(uuid=request.user.referred).first()
                        if accourtReferred.exists():
                            coreSettings = Core.objects.first()
                            accourtReferred.balance = accourtReferred.balance + obj.amount*coreSettings.referredPercent
                            accourtReferred.save()

                    obj.state = currentStatus
                    obj.save()

            return Response({'detail': 'CryptoInvoices Refresh!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': 'NotFound CryptoInvoices!'}, status=status.HTTP_404_NOT_FOUND)
        


class requestInvoice(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):

        method = str(request.data.get('paymentMethod', ''))
        amount = int(request.data.get('paymentAmount', 0))

        data = {'method':method,'amount':amount}
    
        try:
            obj, created = models.Invoice.objects.update_or_create(account=request.user,state='pending', method=method, defaults=data)
            
            if method == "crypto":
                response = makeConfirmoInvoice(amount)
                apiInvoice = response.json().get('id') if response.status_code == 201 else ""
                
            if method != "crypto":
                apiInvoice = str(uuid.uuid4())[:8]

            obj.voucher = apiInvoice
            obj.save()

            return Response({'apiInvoice': apiInvoice}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'NotFound Lottery.'}, status=status.HTTP_404_NOT_FOUND)
        

class requestMessage(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        account = models.UserAccount.objects.get(email=self.request.user.email)
        subject = request.data.get('subject', '')
        message = request.data.get('message', '')

        data = {'subject':subject,'message':message}
    
        try:
            obj = models.Support.objects.create(account=account, **data)
            return Response({'detail': 'The message request has been sent.'}, status=status.HTTP_200_OK)
        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("requestMessage {} --> Error: {}\n".format(date, str(e)))
            return Response({'error': 'NotFound Support.'}, status=status.HTTP_404_NOT_FOUND)
        