import { NextResponse } from 'next/server';

interface RequestBody {
    email: string;
    paymentMethod: string;
    ticket: string;
} 

export async function POST(request: Request) {
  const body: RequestBody = await request.json();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/api/lottery/request-ticketlottery/`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    if (res.status === 200) {
      return res;
    } else if (!res.ok) {
      return NextResponse.json({ error: 'Server responded with an error' });
    }
  } catch (error) {
    return NextResponse.json({ error: 'There was an error with the network request' });
  }
}

