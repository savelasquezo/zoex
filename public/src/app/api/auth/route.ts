import { NextResponse } from 'next/server';

export const fetchAuth = async (session: any) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/auth/users/me/`, {
        headers: { Authorization: `JWT ${session.user.accessToken}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Server responded with an error' });
    }

    if (res.ok) {const userData = await res.json();
        session.user = {
            id: userData.id,
            uuid: userData.uuid,
            name: userData.username,
            email: userData.email,
            phone: userData.phone,
            balance: userData.balance,
            credits: userData.credits,
            accessToken: session.user.accessToken,
            refreshToken: session.user.refreshToken,
        };
    }
    return session;
  } catch (error) {
    return NextResponse.json({ error: 'There was an error with the network request' });
  }
}
