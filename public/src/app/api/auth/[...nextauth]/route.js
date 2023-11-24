import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login/`, {
          method: 'POST',
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`¡Error authorize! ${res.statusText}`);
        }

        const { access, refresh } = await res.json();

        const userRes = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/auth/users/me/`, {
          headers: { Authorization: `JWT ${access}` },
        });

        if (!userRes.ok) {
          throw new Error(`Error on /auth/users/me/: ${userRes.statusText}`);
        }

        const userData = await userRes.json();

        const user = {
          id: userData.id,
          uuid: userData.uuid,
          name: userData.username,
          email: userData.email,
          phone: userData.phone,
          balance: userData.balance,
          accessToken: access,
          refreshToken: refresh,
        };

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        return { ...token, ...session.user };
      }

      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
