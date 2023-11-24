import json
from channels.generic.websocket import AsyncWebsocketConsumer
import apps.lottery.models as models
from asgiref.sync import sync_to_async

@sync_to_async
def getAsyncLottery():
    return models.Lottery.objects.get(is_active=True)

@sync_to_async
def getAsyncTickets(lottery):
    return list(models.TicketsLottery.objects.filter(lottery=lottery).values_list('ticket', flat=True))

async def getAsyncAviableTickets():
    lottery = await getAsyncLottery()
    getAviableTickets = [str(i).zfill(len(str(lottery.tickets))) for i in range((lottery.tickets+1))]
    getTickets = await getAsyncTickets(lottery)
    iTickets = [i for i in getAviableTickets if i not in getTickets]
    return {'iTickets': iTickets}


class AsyncLotteryConsumer(AsyncWebsocketConsumer):

    async def asyncTicketsLottery(self):
        data = await getAsyncAviableTickets()
        return data

    async def connect(self):
        self.group_name = "groupTicketsLottery"
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

        data = await self.asyncTicketsLottery()
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