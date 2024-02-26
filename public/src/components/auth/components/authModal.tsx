import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { NextResponse } from 'next/server';
import Image from 'next/image';
import CircleLoader from 'react-spinners/CircleLoader';
import { ModalFunction } from '@/lib/types/types';

  
const AuthModal: React.FC<ModalFunction> = ({ closeModal }) => {
    const searchParams = useSearchParams();
    const [token, setToken] = useState('');
    const [uid, setUID] = useState('');
  
    const [activated, setActivated] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
  
    useEffect(() => {
      const tokenParam = searchParams.get('token');
      const uidParam = searchParams.get('uid');
  
      if (tokenParam !== null) {
        setToken(tokenParam);
      }
  
      if (uidParam !== null) {
        setUID(uidParam);
      }
    }, [searchParams]);
  
    const activateAccount = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/auth/users/activation/`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid,
            token,
          }),
        });
        if (res.status === 204) {
          setActivated(true);
          NextResponse.json({ success: 'The request has been processed successfully.' }, { status: 200 });
        }
        
      } catch (error) {
        return NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
  
      } finally {
        setLoading(false);
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push('/?login=True');
    }
    };

    return (
        <div className="w-full h-full">
            <div className="relative w-full h-full flex flex-col items-center justify-start">
                <Image priority width={400} height={200} src={"/assets/image/logoX.webp"} className="object-fit self-start scale-75" alt="" />
                <div className="px-4">
                    <p className="text-sm text-white">¡Bienvenido a Zoexbet!</p><br />
                    <p className="text-xs text-white font-thin text-justify">¡Nos emociona darte la bienvenida a nuestra comunidad! Activa tu cuenta dando clic en el botón "Activar", y ahora estarás listo para sumergirte en la emocionante experiencia de ZoexBet.</p>
                </div>
                <div className="absolute bottom-10 w-full px-4 ">
                    {activated ? (
                    <p className="h-10 bg-green-500 text-white font-semibold rounded-sm py-2 px-4 w-full text-center flex items-center justify-center">
                        Activado
                    </p>
                    ) : (
                    loading ? (
                        <button type="button" className="h-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-sm py-2 px-4 w-full text-center flex items-center justify-center">
                        <CircleLoader loading={loading} size={25} color="#1c1d1f" />
                        </button>
                    ) : (
                        <button type="button" onClick={activateAccount} className="h-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-sm py-2 px-4 w-full text-center uppercase text-sm transition-colors duration-300">Activar</button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal