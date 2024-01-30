import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Session } from 'next-auth';
import { NextResponse } from 'next/server';

import TicketsGiveawayModal from "./ticketsGiveawayModal";
import ListTicketsGiveawayModal from "./listTicketsModal";

import { imageLoader } from '@/utils/imageConfig';

import {AiOutlineClose, AiOutlineShoppingCart} from 'react-icons/ai'

interface GiveawaysModalProps {
    session: Session | null | undefined;
}

interface GiveawayData {
    id: any;
    file: string;
    giveaway: string;
    prize: string;
    value: number;
    tickets: number;
    price: number;
    winner: string | null | undefined;
    date_giveaway: string;
    sold: number;
    date_results: string;
    stream: string | null | undefined;
    amount: number;
    is_active: boolean;
    progress: number
}

export const fetchGiveaways = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/giveaway/fetch-giveaway/`,{
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


const Giveaways: React.FC<GiveawaysModalProps> = ({ session  }) => {
    
    const [showModal, setShowModal] = useState(false);
    const [closingModal, setClosingModal] = useState(false);

    const [activeTab, setActiveTab] = useState('');
    const [giveawayId, setGiveawayId] = useState<string>('');

    const [itemsGiveaway, setItemsGiveaway] = useState<GiveawayData[]>([]);

    const openModal = (tab: string, giveawayId: string) => {
        setGiveawayId(giveawayId);
        setShowModal(true);
        setActiveTab(tab);
    };

    const closeModal = () => {
        setClosingModal(true);
        setTimeout(() => {
            setShowModal(false);
            setClosingModal(false);
        }, 500);
    };


    
    useEffect(() => {
      fetchGiveaways()
        .then((data) => {
            setItemsGiveaway(data);
            localStorage.setItem('itemsGiveaway', JSON.stringify(data));
        })
        .catch((error) => {
            console.error('Error al obtener datos iniciales de imagenSliders:', error);
        });
    }, []);

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-center justify-center py-4">
            {itemsGiveaway?.length > 0 ? (
              (itemsGiveaway).map((itemGiveaway, i) => (
                  <div key={i} className="relative flex flex-col items-center rounded-sm h-40 md:h-80 shadow-inner">
                    <Image width={630} height={300} src={itemGiveaway.file ?? "/assets/demo/giveaway.webp"} className="absolute top-0 left-0 h-[calc(100%-16px)] w-full object-cover rounded-t-sm z-0" loader={imageLoader} alt="" />
                    <div className="absolute top-0 h-2 w-full flex flex-row items-center gap-x-1">
                        <div className='absolute top-0 h-full w-full bg-gradient-to-r from-lime-500 to-red-500 transition-all duration-200'/>
                        <div className="absolute top-0 h-full w-full flex items-end justify-end">
                        <div className='h-full w-full flex  bg-white transition-all duration-200' style={{ width: `${itemGiveaway.progress}%` }} />
                        </div>
                    </div>
                    <button onClick={() => openModal('buyTicket', itemGiveaway.id)} className="absolute bottom-5 right-2 flex items-center justify-between gap-x-2 bg-gray-800 hover:bg-gray-900  border-slate-950 transition-colors duration-300 px-4 py-2 rounded border-b-2">
                      <span className='text-white font-semibold text-base'><AiOutlineShoppingCart /></span>
                      <span className="text-white shadow-inner text-xs uppercase font-semibold hidden md:block">
                        Comprar
                      </span>
                    </button>
                  </div>
              ))
            ) : null}
            {showModal && (
            <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center transition bg-opacity-50 bg-gray-900 backdrop-blur-sm z-40 ${closingModal ? "animate-fade-out animate__animated animate__fadeOut" : "animate-fade-in animate__animated animate__fadeIn"}`}>
                <div className="relative w-4/5 md:w-[55%] flex justify-between items-center h-[26rem]">
                  <button onClick={closeModal} className='absolute top-4 right-4 text-xl text-gray-400 hover:text-gray-600 transition-colors duration-300' ><AiOutlineClose /></button>
                  <div className="w-full h-full bg-gray-800 rounded-2xl p-6">
                    <button onClick={() => openModal('buyTicket',giveawayId)} className={`text-gray-100 rounded-md px-2 py-0.5 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'buyTicket' ? 'bg-red-500 hover:bg-red-600' : ''}`}>Sorteo</button>
                    <button onClick={() => openModal('lstTicket',giveawayId)} className={`text-gray-100 rounded-md px-2 py-0.5 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'lstTicket' ? 'bg-pink-700 hover:bg-pink-800' : ''}`}>Tickets</button>
                    <div className={`${activeTab === 'buyTicket' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
                        <TicketsGiveawayModal closeModal={closeModal} session={session} giveawayId={giveawayId}/>
                    </div>
                    <div style={{ display: activeTab === 'lstTicket' ? 'block' : 'none' }} className={`h-full my-4 ${activeTab === 'lstTicket' ? 'animate-fade-in animate__animated animate__fadeIn' : 'animate-fade-out animate__animated animate__fadeOut'} ${activeTab === 'buyTicket' ? 'hidden' : ''}`}>
                        <ListTicketsGiveawayModal closeModal={closeModal} session={session} giveawayId={giveawayId}/>
                    </div>
                  </div>
                </div>
              </div>
          )}
        </div>
    );
};

export default Giveaways;

