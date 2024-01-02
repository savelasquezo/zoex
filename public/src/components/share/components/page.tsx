import React, { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { fetchInfo } from '@/app/api/images/info/route';

import {
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'next-share';

type ShareModalProps = {
    closeModal: () => void;
    session: Session | null | undefined;
};

type InfoType = {
    hashtag: string;
};


const ShareModal: React.FC<ShareModalProps> = ({ closeModal, session  }) => {
  const [info, setInfo] = useState<InfoType>();

  useEffect(() => {
    fetchInfo()
      .then((data: InfoType) => {
        setInfo(data);
      })
      .catch((error) => {
        console.error('Error al obtener datos iniciales de imagenSliders:', error);
      });
  }, []);

  const shareURL = `https://${process.env.NEXT_PUBLIC_APP_SITE}/?singup=True&uuid=${session?.user?.uuid || ''}`
  const shareHashtag = `${info?.hashtag}`
  const shareTittle = "¡Atencion Comunidad! registrarse a través de mi enlace, ¡obtendrán un BONUS EXCLUSIVO del 50% en su primera recarga! 💰✨"

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(shareURL)
    setCopySuccess(true);
  };

  useEffect(() => {
    if (copySuccess) {
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    }
  }, [copySuccess]);

  return (
    <div>
      <div className='absolute top-4 inline-flex gap-x-2 w-full justify-start items-center z-0'>
        <FacebookShareButton url={shareURL} hashtag={shareHashtag}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TelegramShareButton url={shareURL} title={shareTittle}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>
        <TwitterShareButton url={shareURL} title={shareTittle}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <WhatsappShareButton url={shareURL} title={shareTittle}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
      <p className='mt-12 text-xs font-thin text-center text-white'>Genera ingresos de forma pasiva compartiendo el Link de referido con tus amigos, gana el 5% de todoas las recargas que realicen, puedes usar este saldo para jugar o retirarlo a tu cuenta bancaria</p>
      <div className='w-full h-18 mt-4 px-4 flex flex-col justify-center items-center'>
        <span onClick={handleCopyClick} className='w-4/5 h-12 bg-slate-950 text-gray-300 flex items-center justify-center rounded-lg cursor-copy'>{session?.user?.uuid || ''}</span>
        {copySuccess !== null && (<span className={`ml-2 p-2 h-6 uppercase text-xs font-semibold ${copySuccess ? 'text-green-500' : ''}`}>{copySuccess ? '¡Copiado al portapapeles!' : ''}</span>)}
      </div>
      <p className='mt-6 text-xs font-thin text-center text-white'>Usando tu link de registro tus amigos o seguidores 
      recibiran un 50% de saldo en su primera recarga, disponible para jugar en cualquiera de nuestros sorteos, Aplican Terminos & condiciones</p>
    </div>
  );
};

export default ShareModal;