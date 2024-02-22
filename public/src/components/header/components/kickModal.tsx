import React, { useState, useEffect, ChangeEvent } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { NextResponse } from 'next/server';
import { InfoType } from '@/lib/types/types';

import {AiOutlineClose } from 'react-icons/ai'

const KickModal: React.FC = () => {
  const [info, setInfo] = useState<InfoType | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [closingModal, setClosingModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setClosingModal(true);
    setTimeout(() => {
      setShowModal(false);
      setClosingModal(false);
    }, 500);
  };

  useEffect(() => {
    const storedInfo = localStorage.getItem('infoData');
    if (storedInfo) {
      try {
        const parsedInfo = JSON.parse(storedInfo);
        setInfo(parsedInfo);
      } catch (error) {
        NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
      }
    }
    return () => {};
  }, []);

  return (
    <div>
        {info?.stream && info.stream.trim().length > 1 && (
        <div className="fixed bottom-16 right-4 flex items-center justify-center z-40">
            <button onClick={openModal} className="bg-slate-950 rounded-full border-2 p-4 border-lime-400 hover:border-lime-500 hover:scale-105 transition duration-300">
                <Image priority width={400} height={400} src={"/assets/image/kick.webp"} className="h-8 w-auto object-fit self-start z-10" alt="" />
            </button>
        </div>
        )}
        {showModal && (
        <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center transition bg-opacity-50 bg-gray-900 backdrop-blur-sm z-40 ${closingModal ? "animate-fade-out animate__animated animate__fadeOut" : "animate-fade-in animate__animated animate__fadeIn"}`}>
            <div className="relative w-2/3 h-24 md:h-36 lg:w-2/5 max-w-[30rem] flex justify-start items-center rounded-2xl bg-slate-950 shadow-2xl">
                <button onClick={closeModal} className='absolute top-4 right-4 text-xl text-gray-400 hover:text-gray-600 transition-colors duration-300' ><AiOutlineClose /></button>
                <a href={`${info?.stream}`} target="blank" className="absolute -left-8 bg-slate-950 rounded-full border-2 border-lime-400 hover:border-red-500 active:hover:border-red-800 active:shadow-inner transition duration-300 p-8 md:p-12">
                    <Image priority width={400} height={400} src={"/assets/image/kick00.webp"} className="h-12 md:h-20 w-auto object-fit self-start z-10" alt="" />
                </a>
                <div className="ml-24 md:ml-44 text-white">
                    <Image priority width={380} height={120} src={"/assets/image/kick01.webp"} className="h-10 md:h-16 w-auto object-fit self-start z-10" alt="" />
                    <p className="w-full uppercase font-semibold text-[0.7rem] md:text-[1.1rem] text-justify">Transmision en Vivo</p>
                </div>
            </div>
        </div>
        )}
  </div>
  );
};

export default KickModal;
