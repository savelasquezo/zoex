'use client';

import dotenv from 'dotenv';
dotenv.config();

import React, { useState, useEffect } from "react";
import { SessionProvider } from 'next-auth/react';

import Header from '@/components/header/index';
import Footer from '@/components/footer/index';
import Slider from '@/components/slider/index';
import Lottery from '@/components/lottery/index';
import MiniLottery from '@/components/minilottery/index';
import Giveaways from '@/components/giveaways/index';
import History from '@/components/history/index';
import { NextResponse } from 'next/server';
import Video from '@/components/video/index';

import WhatsAppWidget from "react-whatsapp-chat-widget";
import "react-whatsapp-chat-widget/index.css";

import { InfoType } from '@/lib/types/types';



const fetchInfo = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/app/core/fetch-info/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('infoData', JSON.stringify(data));
      NextResponse.json({ success: 'The request has been processed successfully.' }, { status: 200 });
      return data;
    }


  } catch (error) {
    return NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
  }
}



export default function Home() {
  const [info, setInfo] = useState<InfoType | undefined>(undefined);
  useEffect(() => {
    fetchInfo()
      .then((data: InfoType) => {
        localStorage.setItem('infoData', JSON.stringify(data));
      })
      .catch((error) => {
        NextResponse.json({ error: 'Server responded with an error' });
      });
    const storedInfo = localStorage.getItem('infoData');
    if (storedInfo) {
      try {
        const parsedInfo = JSON.parse(storedInfo);
        setInfo(parsedInfo);
      } catch (error) {
        NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
      }
    }
  }, []);


  return (
    <SessionProvider >
      <Header />
      <main className='w-full h-full overflow-x-hidden bg-slate-800'>
        <Slider />
        <div className="w-full flex flex-col gap-y-4 p-8">
          <Lottery />
          <MiniLottery />
          <Giveaways />
        </div>
        <div className='mb-10'>
          {/* <History /> */}
        </div>
      </main>
      <Video/>
      <WhatsAppWidget
            phoneNo={`57${info?.phone}`}
            position="left"
            widgetWidth="360px"
            widgetWidthMobile="360px"
            autoOpen={false}
            autoOpenTimer={5000}
            messageBox={true}
            messageBoxTxt="Hola Zoexbet, Necesito Informacion"
            iconSize="40"
            iconColor="white"
            iconBgColor="#25d366"
            headerIcon={`/assets/image/logoX.webp`}
            headerIconColor="red"
            headerTxtColor="black"
            headerBgColor="#25d366"
            headerTitle="ZoexBet"
            headerCaption="Online"
            bodyBgColor="#ffff"
            chatPersonName="Support"
            chatMessage={<>¡Bienvenido a Zoexbet! 👋 <br /><br /> ¿Como puedo ayudarte?</>}
            footerBgColor="#999"
            placeholder="Escribe un Mensaje"
            btnBgColor="#25d366"
            btnTxt="Chatear Ahora"
            btnTxtColor="black"
        />
      <Footer />
    </SessionProvider>
  );
}
