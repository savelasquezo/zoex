'use client';
import { SessionProvider } from 'next-auth/react';

export default function Container({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider>
          <div>
            <div className="bg-gray-900 border-gray-200 px-4 lg:px-2 py-2.5">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                  {children}
                </div>
            </div>
        </div>
      </SessionProvider>
    );
};
