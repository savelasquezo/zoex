import { NextResponse } from 'next/server';

export const fetchLottery = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/api/lottery/fetch-lottery/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!res.ok) {
      return NextResponse.json({ error: 'Server responded with an error' });
    }
    const data = await res.json();
    return data;
  } catch (error) {
    return NextResponse.json({ error: 'There was an error with the network request' });
  }
}


export const fetchLotteryHistory = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/api/lottery/fetch-lottery-history/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!res.ok) {
      return NextResponse.json({ error: 'Server responded with an error' });
    }
    const data = await res.json();
    return data;
  } catch (error) {
    return NextResponse.json({ error: 'There was an error with the network request' });
  }
}