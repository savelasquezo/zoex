from django.urls import path
import apps.user.views as view

urlpatterns = [
    path('request-withdraw/', view.requestWithdraw.as_view(), name='request-withdraw'),
    path('fetch-withdrawals/', view.fetchWithdrawals.as_view(), name='fetch-withdrawals'),
    path('fetch-invoices/', view.fetchInvoices.as_view(), name='fetch-invoices'),
    path('fetch-invoice-refered/', view.fetchInvoiceRefered.as_view(), name='fetch-invoice-refered'),
    path('request-invoice/', view.requestInvoice.as_view(), name='request-invoice'),
    path('refresh-invoices/', view.refreshInvoices.as_view(), name='refresh-invoices'),
    path('update-account-info/', view.updateAccountInfo.as_view(), name='update-account-info'),
    path('notify-invoice-confirmo/', view.notifyInvoiceConfirmo.as_view(), name='notify-invoice-confirmo'),
    path('notify-invoice-bold/', view.notifyInvoiceBold.as_view(), name='notify-invoice-bold'),
]