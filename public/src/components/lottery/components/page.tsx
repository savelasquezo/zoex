import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {AiOutlineClose, AiOutlineShoppingCart} from 'react-icons/ai'

import TicketsLotteryModal from "./ticketsLotteryModal";

import { fetchLottery } from '@/app/api/lottery/route';


interface LotteryData {
    banner: string;
  }

const Lottery = () => {

    const [lottery, setLottery] = useState<LotteryData>({ banner: '' });

    const [showModal, setShowModal] = useState(false);
    const [closingModal, setClosingModal] = useState(false);

    const [activeTab, setActiveTab] = useState('');

    const openModal = (tab: string) => {
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
        fetchLottery()
          .then((data) => {
            setLottery(data);
          })
          .catch((error) => {
            console.error('Error al obtener datos iniciales de imagenSliders:', error);
          });
      }, []);


    return (
        <div className="w-full h-full z-10">
            <div className="relative h-40 md:h-96 items-center">
                {lottery.banner ? (<>
                    <Image width={1250} height={385} className="absolute top-0 left-0 h-full w-full object-cover rounded-md z-0" src={lottery.banner} alt=""/>
                    <button className="z-10 absolute bottom-3 right-3 flex items-center justify-between bg-gray-800 hover:bg-gray-900  border-slate-950 transition-colors duration-300 px-2 rounded border-b-2 overflow-hidden">
                      <span className='text-white font-semibold text-lg'><AiOutlineShoppingCart /></span>
			                <span className="block text-white shadow-inner text-sm py-2 px-4 tracking-wide uppercase font-bold"
                        onClick={() => openModal('buyTicket')}>
				                Comprar
			                </span>
		                </button>
                  </>) : (<>
                  <Image width={1280} height={800} className="absolute top-0 left-0 h-full w-full object-cover rounded-md z-0" src={"https://flowbite.com/docs/images/carousel/carousel-1.svg"} alt=""/>
                  <span className="z-10 absolute bottom-3 right-3 flex items-center justify-between bg-gray-800  border-slate-950 transition-colors duration-300 px-2 rounded border-b-2 overflow-hidden cursor-not-allowed">
                    <span className='text-white font-semibold text-lg'><AiOutlineShoppingCart /></span>
                    <span className="block text-white shadow-inner text-sm py-2 px-4 tracking-wide uppercase font-bold">
                      Comprar
                    </span>
                  </span>
              </>)}
            </div>
            {showModal && (
            <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center transition bg-opacity-50 bg-gray-900 backdrop-blur-sm z-40 ${closingModal ? "animate-fade-out animate__animated animate__fadeOut" : "animate-fade-in animate__animated animate__fadeIn"}`}>
                <div className="relative w-[55%] flex justify-between items-center h-[50%]">
                  <button onClick={closeModal} className='absolute top-4 right-4 text-xl text-gray-400 hover:text-gray-600 transition-colors duration-300' ><AiOutlineClose /></button>
                  <div className="w-full h-full bg-gray-800 rounded-2xl p-6">
                    <button onClick={() => openModal('buyTicket')} className={`text-gray-100 rounded-full px-4 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'login' ? 'bg-red-500 hover:bg-red-600' : ''}`}>Ingresar</button>
                    <button onClick={() => openModal('lstTicket')} className={`text-gray-100 rounded-full px-4 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'singup' ? 'bg-pink-700 hover:bg-pink-800' : ''}`}>Inscribirse</button>
                    <div style={{ display: activeTab === 'buyTicket' ? 'block' : 'none' }} className={`h-full my-4 ${activeTab === 'buyTicket' ? 'animate-fade-in animate__animated animate__fadeIn' : 'animate-fade-out animate__animated animate__fadeOut'} ${activeTab === 'lstTicket' ? 'hidden' : ''}`}>
                      <TicketsLotteryModal closeModal={closeModal}/>
                    </div>
                    <div style={{ display: activeTab === 'lstTicket' ? 'block' : 'none' }} className={`h-full my-4 ${activeTab === 'lstTicket' ? 'animate-fade-in animate__animated animate__fadeIn' : 'animate-fade-out animate__animated animate__fadeOut'} ${activeTab === 'buyTicket' ? 'hidden' : ''}`}>
                      <p>Modal Tickets Adquiridos</p>
                    </div>
                  </div>
                </div>
              </div>
          )}
        </div>
    );
};

export default Lottery