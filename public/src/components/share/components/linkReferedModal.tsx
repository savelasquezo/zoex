import React, { useEffect, useState } from 'react';

import { SessionModal, InfoType } from '@/lib/types/types';

import { LuCopyCheck } from "react-icons/lu";


const LinkReferedModal: React.FC<SessionModal>  = ({closeModal, session }) => {
    const [info, setInfo] = useState<InfoType>();

    useEffect(() => {
        const storedInfo = localStorage.getItem('infoData');
        if (storedInfo) {
          try {
            const parsedInfo = JSON.parse(storedInfo);
            setInfo(parsedInfo);
          } catch (error) {
            console.error('Error parsing stored info data:', error);
          }
        }
        return () => {};
      }, []);

      const shareURL = `${process.env.NEXT_PUBLIC_APP_API_URL}/?singup=True&uuid=${session?.user?.uuid || ''}`
      const [copySuccess, setCopySuccess] = useState(false);
    
      const handleCopyClick = () => {
        navigator.clipboard.writeText(shareURL)
        setCopySuccess(true);
      };

    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
          <p className='mt-4 text-[0.65rem] md:text-xs font-thin text-center text-gray-300'>Genera ingresos de forma pasiva compartiendo el Link de referido con tus amigos, gana el {info?.referredPercent}% de todoas las recargas que realicen, puedes usar este saldo o retirarlo a tu cuenta bancaria</p>
          <div className='relative w-4/5 h-14 bg-slate-950 rounded-lg cursor-copy mt-4 px-4 flex flex-col justify-center items-center'>
            <span onClick={handleCopyClick} className='text-gray-300 flex items-center h-10'>{session?.user?.uuid || ''}</span>
            {copySuccess !== null && (<span className={`absolute right-2 ml-2 p-2 h-6 uppercase text-xs font-semibold ${copySuccess ? 'text-green-500' : ''}`}>{copySuccess ? <LuCopyCheck /> : ''}</span>)}
          </div>
          <p className='mt-4 text-[0.5rem] md:text-xs font-thin text-center text-gray-300'>Usando tu link de registro tus amigos o seguidores 
          recibiran un {info?.bonusPercent}% de saldo en su primera recarga, disponible para jugar en cualquiera de nuestros sorteos, Aplican Terminos & condiciones</p>
      </div>
    );
  };
  
  export default LinkReferedModal;
  
