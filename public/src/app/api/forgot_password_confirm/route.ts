import { NextResponse } from 'next/server';

interface RequestBody {
  uid: any;
  token: any;
  new_password: any;
  re_new_password: any;
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/auth/users/reset_password_confirm/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      console.error('Server responded with an error:', res.status);
      return NextResponse.json({ error: 'Server responded with an error' }, { status: res.status });
    }

    if (res.headers.get('content-length') === '0') {
      return NextResponse.json({ success: 'Password reset successfully' });
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Network request error:', error);
    return NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
  }
}
