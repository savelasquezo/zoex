'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import {AiOutlineClose, AiOutlineMail} from 'react-icons/ai'
import LoginModal from "./loginModal";
import RegisterModal from "./registerModal";
import { signOut, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

const Authentication = () => {
    const { data: session } = useSession();

    const [showModal, setShowModal] = useState(false);
    const [closingModal, setClosingModal] = useState(false);
  
    const [activeTab, setActiveTab] = useState('login');
  
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

    return (
        <div className="inline-flex items-center h-full ml-5 lg:w-2/5 lg:justify-end lg:ml-0 gap-x-3">
            {session && session.user ? (
              <div className='inline-flex gap-x-4'>
                <p className='text-gray-800 bg-white rounded-full'>Ha iniciado sesion - 300</p>
                <button onClick={() => {signOut();}} className="bg-pink-700 hover:bg-pink-900 text-white uppercase text-xs font-semibold py-1 px-4 rounded transition-colors duration-300">Salir</button>
              </div>
                          ) : (
              <div className='inline-flex gap-x-2'>
                <button onClick={() => openModal('login')} className="bg-red-500 hover:bg-red-700 text-white text-sm font-semibold py-1 px-2 rounded transition-colors duration-300">Ingresar</button>
                <button onClick={() => openModal('singup')} className="bg-pink-700 hover:bg-pink-900 text-white text-sm font-semibold py-1 px-2 rounded transition-colors duration-300">Inscribirse</button>
              </div>
            )}
            {showModal && (
            <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center transition bg-opacity-50 bg-gray-900 backdrop-blur-sm z-40 ${closingModal ? "animate-fade-out animate__animated animate__fadeOut" : "animate-fade-in animate__animated animate__fadeIn"}`}>
                <div className="relative w-[55%] flex justify-between items-center h-[90%]">
                  <button onClick={closeModal} className='absolute top-4 right-4 text-xl text-gray-400 hover:text-gray-600 transition-colors duration-300' ><AiOutlineClose /></button>
                  <Image width={1200} height={800} src={"/assets/image/banner.png"} alt="" className="h-full w-[45%] object-cover rounded-l-2xl"/>
                  <div className="w-[55%] h-full bg-gray-800 rounded-r-2xl p-6">
                    <button onClick={() => openModal('login')} className={`text-gray-100 rounded-full px-4 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'login' ? 'bg-red-500 hover:bg-red-600' : ''}`}>Ingresar</button>
                    <button onClick={() => openModal('singup')} className={`text-gray-100 rounded-full px-4 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'singup' ? 'bg-pink-700 hover:bg-pink-800' : ''}`}>Inscribirse</button>
                    <div style={{ display: activeTab === 'login' ? 'block' : 'none' }} className={`h-full my-4 ${activeTab === 'login' ? 'animate-fade-in animate__animated animate__fadeIn' : 'animate-fade-out animate__animated animate__fadeOut'} ${activeTab === 'signup' ? 'hidden' : ''}`}>
                      <LoginModal closeModal={closeModal}/>
                      <div className="text-start items-center inline-flex gap-x-2">
                        <p className="text-xs text-gray-300">¿No tienes una cuenta?</p>
                        <button onClick={() => openModal('singup')} className="cursor-pointer text-red-500 hover:text-pink-600 transition-colors duration-300 -mt-1">Inscribete</button>
                      </div>
                      <div><button className="hover:underline text-xs text-blue-500">¿Olvidaste la contraseña?</button></div>
                    </div>
                    <div style={{ display: activeTab === 'singup' ? 'block' : 'none' }} className={`h-full my-4 ${activeTab === 'singup' ? 'animate-fade-in animate__animated animate__fadeIn' : 'animate-fade-out animate__animated animate__fadeOut'} ${activeTab === 'login' ? 'hidden' : ''}`}>
                      <RegisterModal closeModal={closeModal}/>
                      <div className="inline-flex gap-x-2 items-center">
                        <p className="text-xs text-gray-300">¿Ya tienes una cuenta?</p><button onClick={() => openModal('login')} className="cursor-pointer text-red-500 hover:text-pink-600 transition-colors duration-300 -mt-1">Ingresar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}
        </div>
    );
};

export default Authentication