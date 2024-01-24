import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';

import { imageLoader } from '@/utils/imageConfig';

import TicketsLotteryModal from "./ticketsLotteryModal";
import ListTicketsLotteryModal from "./listTicketsModal";
import ListHistoryLotteryModal from "./listHistoryModal";

import {AiOutlineClose, AiOutlineShoppingCart} from 'react-icons/ai'

interface LotteryModalProps {
  session: Session | null | undefined;
}
interface LotteryData {
    banner: string;
}


export const fetchLottery = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/lottery/fetch-lottery/`,{
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



const Lottery: React.FC<LotteryModalProps> = ({ session  }) => {

    const [lottery, setLottery] = useState<LotteryData>({ banner: '' });

    const [showModal, setShowModal] = useState(false);
    const [closingModal, setClosingModal] = useState(false);

    const closeModal = () => {
      setClosingModal(true);
      setTimeout(() => {
        setShowModal(false);
        setClosingModal(false);
      }, 500);
    };

    const [activeTab, setActiveTab] = useState('');

    const openModal = (tab: string) => {
      setShowModal(true);
      setActiveTab(tab);
    };

    useEffect(() => {
      fetchLottery()
        .then((data) => {
          setLottery(data);
          localStorage.setItem('lottery', JSON.stringify(data));
        })
        .catch((error) => {
          console.error('Server responded with an error :', error);
        });
    }, []);


    return (
      <div className="w-full h-full z-10">
        {lottery? (
        <div className="relative h-40 md:h-96 items-center">
          <Image width={1280} height={400} src={lottery?.banner ?? "/assets/demo/lottery.webp"} loader={imageLoader} className="absolute top-0 left-0 h-full w-full object-cover rounded-md z-0"  alt=""/>
          <button className="z-10 absolute bottom-3 right-3 flex items-center justify-between bg-gray-800 hover:bg-gray-900  border-slate-950 transition-colors duration-300 px-2 rounded border-b-2 overflow-hidden">
            <span className='text-white font-semibold text-lg'><AiOutlineShoppingCart /></span>
            <span className="block text-white shadow-inner text-sm py-2 px-4 tracking-wide uppercase font-bold"
              onClick={() => openModal('buyTicket')}>
              Comprar
            </span>
          </button>
        </div>
        ) : null}
        {showModal && (
        <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center transition bg-opacity-50 bg-gray-900 backdrop-blur-sm z-40 ${closingModal ? "animate-fade-out animate__animated animate__fadeOut" : "animate-fade-in animate__animated animate__fadeIn"}`}>
            <div className="relative w-[55%] flex justify-between items-center h-[26rem]">
              <button onClick={closeModal} className='absolute top-4 right-4 text-xl text-gray-400 hover:text-gray-600 transition-colors duration-300' ><AiOutlineClose /></button>
              <div className="w-full h-full bg-gray-800 rounded-2xl p-6">
                <button onClick={() => openModal('buyTicket')} className={`text-gray-100 rounded-md px-2 py-0.5 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'buyTicket' ? 'bg-red-500 hover:bg-red-600' : ''}`}>Loteria</button>
                <button onClick={() => openModal('lstTicket')} className={`text-gray-100 rounded-md px-2 py-0.5 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'lstTicket' ? 'bg-pink-700 hover:bg-pink-800' : ''}`}>Tickets</button>
                <button onClick={() => openModal('lshistory')} className={`text-gray-100 rounded-md px-2 py-0.5 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'lshistory' ? 'bg-yellow-700 hover:bg-yellow-800' : ''}`}>Historial</button>
                <div className={`${activeTab === 'buyTicket' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
                  <TicketsLotteryModal closeModal={closeModal} session={session}/>
                </div>
                <div className={`${activeTab === 'lstTicket' ? 'w-full h-full block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
                  <ListTicketsLotteryModal closeModal={closeModal} session={session}/>
                </div>
                <div className={`${activeTab === 'lshistory' ? 'w-full h-full block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
                  <ListHistoryLotteryModal closeModal={closeModal} session={session}/>
                </div>
              </div>
            </div>
          </div>
          )}
      </div>
    );
};

export default Lottery
