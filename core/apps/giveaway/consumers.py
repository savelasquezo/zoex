import json
from channels.generic.websocket import AsyncWebsocketConsumer
import apps.giveaway.models as models
from asgiref.sync import sync_to_async

@sync_to_async
def getAsyncGiveaway(id):
    return models.Giveaway.objects.get(pk=id)

@sync_to_async
def getAsyncTickets(giveaway):
    return list(models.TicketsGiveaway.objects.filter(giveaway=giveaway).values_list('ticket', flat=True))

async def getAsyncAviableTickets(id):
    giveaway = await getAsyncGiveaway(id)
    getAviableTickets = [str(i).zfill(len(str(giveaway.tickets))) for i in range((giveaway.tickets+1))]
    getTickets = await getAsyncTickets(giveaway)
    iTickets = [i for i in getAviableTickets if i not in getTickets]
    return {'iTickets': iTickets}


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