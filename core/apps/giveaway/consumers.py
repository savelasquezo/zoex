import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

from.serializers import GiveawaySerializer

@sync_to_async
def getAsyncGiveaway(id):
    from apps.giveaway.models import Giveaway
    return Giveaway.objects.get(pk=id)

@sync_to_async
def getAsyncTickets(giveaway):
    from apps.giveaway.models import TicketsGiveaway
    return list(TicketsGiveaway.objects.filter(giveaway=giveaway).values_list('ticket', flat=True))

async def getAsyncAviableTickets(id):
    giveaway = await getAsyncGiveaway(id)
    getAviableTickets = [str(i).zfill(len(str(giveaway.tickets))) for i in range((giveaway.tickets+1))]
    getTickets = await getAsyncTickets(giveaway)
    tickets = [i for i in getAviableTickets if i not in getTickets]

    serializer = GiveawaySerializer(giveaway)

    return {'giveaway':serializer.data,'tickets': tickets}


class AsyncGiveawayConsumer(AsyncWebsocketConsumer):

    async def asyncTicketsGiveaway(self):
        idGiveaway = self.scope['url_route']['kwargs']['id']
        data = await getAsyncAviableTickets(id=idGiveaway)
        return data

    async def connect(self):
        self.group_name = "groupTicketsGiveaway"
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

        data = await self.asyncTicketsGiveaway()
        await self.send(json.dumps(data))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        pass

    async def asyncSignal(self, event):
        data = event['data']
        await self.send(json.dumps(data))