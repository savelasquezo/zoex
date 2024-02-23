import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      uuid: string;
      referred: string;
      username: string;
      email: string;
      phone: string;
      balance: number;
      credits: number;
      location: string | undefined;
      billing: string | undefined;
      frame: string | undefined;
      bonus: boolean;
      accessToken: string;
      refreshToken: string;
    };
  }
}
