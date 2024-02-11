import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';


const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {

        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/auth/jwt/create/`, {
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

        const userRes = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/auth/users/me/`, {
          headers: { Authorization: `JWT ${access}` },
        });

        if (!userRes.ok) {
          throw new Error(`Error on /auth/users/me/: ${userRes.statusText}`);
        }

        const userData = await userRes.json();

        const user = {
          id: userData.id,
          uuid: userData.uuid,
          referred: userData.referred,
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          balance: userData.balance,
          credits: userData.credits,
          location: userData.location,
          billing: userData.billing,
          frame: userData.frame,
          bonus: userData.bonus,
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
      if (token && token.accessToken) {
        const decodedToken = jwt.decode(token.accessToken);
    
        if (decodedToken && typeof decodedToken === 'object' && 'exp' in decodedToken && decodedToken.exp !== undefined && decodedToken.exp < Date.now() / 1000) {
          session.user = null;
        }
      }
      return { ...token, ...user };
    },

    async session({ session, token }) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/auth/users/me/`, {
        headers: { Authorization: `JWT ${token.accessToken}` },
      });

      if (res.ok) {
        const userData = await res.json();
        session.user = {
          id: userData.id,
          uuid: userData.uuid,
          referred: userData.referred,
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          balance: userData.balance,
          credits: userData.credits,
          location: userData.location,
          billing: userData.billing,
          frame: userData.frame,
          bonus: userData.bonus,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        };
      }

      return session;
    },
    async signOut({ url, baseUrl }) {
      return Promise.resolve(baseUrl);
    },
  },
})


export { handler as GET, handler as POST }
