import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

@sync_to_async
def getAsyncMiniLottery():
    from apps.minilottery.models import MiniLottery
    return MiniLottery.objects.get(is_active=True)

@sync_to_async
def getAsyncTickets(minilottery):
    from apps.minilottery.models import TicketsMiniLottery
    return list(TicketsMiniLottery.objects.filter(minilottery=minilottery).values_list('ticket', flat=True))

@sync_to_async
def getAsyncsSerializersMiniLottery(minilottery):
    from .serializers import MiniLotterySerializer
    serializer = MiniLotterySerializer(minilottery)
    return serializer

async def getAsyncAviableTickets():
    minilottery = await getAsyncMiniLottery()
    getAviableTickets = [str(i).zfill(len(str(minilottery.tickets))) for i in range((minilottery.tickets+1))]
    getTickets = await getAsyncTickets(minilottery)
    tickets = [i for i in getAviableTickets if i not in getTickets]

    serializer = await getAsyncsSerializersMiniLottery(minilottery)

    return {'minilottery':serializer.data,'tickets': tickets}


class AsyncMiniLotteryConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.group_name = "groupTicketsMiniLottery"
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

        data = await self.asyncTicketsMiniLottery()
        await self.send(json.dumps(data))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def asyncTicketsMiniLottery(self):
        data = await getAsyncAviableTickets()
        return data

    async def asyncSignal(self, event):
        data = event['data']
        await self.send(json.dumps(data))


        
class AsyncTicketsConsumerMiniLottery(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def asyncSignal(self, event):
        data = event['data']
        await self.send(json.dumps(data))