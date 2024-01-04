import { NextResponse } from 'next/server';

interface RequestBody {
  withdrawMethod: string;
  withdrawAmount: number;
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json();
  const JWT = request.headers.get('Authorization');
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/api/user/request-withdraw/`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${JWT}`,
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

