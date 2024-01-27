import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

@sync_to_async
def getAsyncLottery():
    from apps.lottery.models import Lottery
    return Lottery.objects.get(is_active=True)

@sync_to_async
def getAsyncTickets(lottery):
    from apps.lottery.models import TicketsLottery
    return list(TicketsLottery.objects.filter(lottery=lottery).values_list('ticket', flat=True))

@sync_to_async
def getAsyncsSerializersLottery(lottery):
    from .serializers import LotterySerializer
    serializer = LotterySerializer(lottery)
    return serializer

async def getAsyncAviableTickets():
    lottery = await getAsyncLottery()
    getAviableTickets = [str(i).zfill(len(str(lottery.tickets))) for i in range((lottery.tickets+1))]
    getTickets = await getAsyncTickets(lottery)
    tickets = [i for i in getAviableTickets if i not in getTickets]

    serializer = getAsyncsSerializersLottery(lottery)

    return {'lottery':serializer.data,'tickets': tickets}


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

    async def asyncSignal(self, event):
        data = event['data']
        await self.send(json.dumps(data))


        
class AsyncTicketsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def asyncSignal(self, event):
        data = event['data']
        await self.send(json.dumps(data))