'use client';

import dotenv from 'dotenv';
dotenv.config();

import React from 'react';
import { SessionProvider } from 'next-auth/react';

import Header from '@/components/header/index';
import Footer from '@/components/footer/index';
import Slider from '@/components/slider/index';
import Lottery from '@/components/lottery/index';
import Giveaways from '@/components/giveaways/index';
import History from '@/components/history/index';

import '@/styles/styles.css';


export default function Home() {
  return (
    <SessionProvider>
      <Header />
      <main className='w-full h-full overflow-x-hidden bg-slate-800'>
        <Slider />
        <div className="w-full flex flex-col gap-y-4 p-8">
          <Lottery />
          <Giveaways />
        </div>
        <div className='mb-10'>
          {/* <History /> */}
        </div>
      </main>
      <Footer />
    </SessionProvider>
  );
}
