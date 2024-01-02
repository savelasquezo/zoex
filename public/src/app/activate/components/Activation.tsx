'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CircleLoader from 'react-spinners/CircleLoader';

export default function Activation() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [uid, setUID] = useState('');

  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(false);

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
    const res = await fetch('/api/activation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        token,
      }),
    });

    if (res.status !== 204) {
      const data = await res.json();
      console.log('No pudimos activar este pedido, verifica si la cuenta ya esta activa.');
    } else {
      setActivated(true);
    }
    setLoading(false);
  };

  const router = useRouter();

  useEffect(() => {
    if (activated) {
      router.push('/?login=True');
    }
  }, [activated]);

  return (
    <div>
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
          <button type="button" onClick={activateAccount}
          className="h-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-sm py-2 px-4 w-full text-center uppercase text-sm transition-colors duration-300">Activar</button>
          )
      )}
    </div>
  );
}
