'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';

import Header from '@/components/header/index';
import Footer from '@/components/footer/index';
import Carousel from '@/components/slider/index';
import Cards from '@/components/giveaways/index';
import Lottery from '@/components/lottery/index';

import '@/styles/styles.css';

export default function Home() {
  return (
    <SessionProvider>
      <Header />
      <main className='w-full h-full overflow-x-hidden bg-slate-800'>
        <Carousel />
        <div className="w-full h-full flex flex-col gap-y-4 p-8 mb-10">
          <Lottery />
          <Cards />
        </div>
      </main>
      <Footer />
    </SessionProvider>
  );
}
