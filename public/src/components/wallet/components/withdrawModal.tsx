import React, { useState } from 'react';
import CircleLoader from 'react-spinners/CircleLoader';
import { NextResponse } from 'next/server';
import { useRouter } from 'next/navigation';
import { SessionModal } from '@/lib/types/types';

import { FiDollarSign } from "react-icons/fi";
import { RiBankCardFill } from "react-icons/ri";


const WithdrawModal: React.FC<SessionModal> = ({ closeModal, session  }) => {

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const [withdraw, setWithdraw] = useState('');

  const [formData, setFormData] = useState({amount: ''});
  const {amount} = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  

  const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setSuccess('');
      setError('');
  
      await new Promise(resolve => setTimeout(resolve, 1000));
      const amountPattern = /^[1-9][0-9]+$/;
      if (!amountPattern.test(amount) || parseInt(amount, 0) >= 99999 || parseInt(amount, 0) <= 9) {
        setError('¡Error - Ingrese un valor valido entre 10 USD & 99999 USD!');
        setLoading(false);
        return;
      }
  
      if (session?.user.billing && session.user.billing.trim().length < 1) {
        setError('¡Error - Informacion bancaria incorrecta');
        setLoading(false);
        return;
      }
  
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/user/request-withdraw/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${session?.user?.accessToken}`,
          },
          body: JSON.stringify({    
            amount,
          }),
        });
        const data = await res.json();
        if (data.error) {
          setError('¡Error en Facturacion! Intentelo Nuevamente');
          return NextResponse.json({ success: 'The request has been processed successfully.' }, { status: 200 });
        }

        setSuccess('¡Facturacion Exitosa!');
        setRegistrationSuccess(true);
        setWithdraw(data.apiWithdraw);
        if (session && session.user) {session.user.balance = data.newBalance;}
        return NextResponse.json({ success: 'The request has been processed successfully.' }, { status: 200 });

      } catch (error) {
        NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
      } finally {
        setLoading(false);
    }
      
  };

  const openProfile = async () => {
    closeModal()
    await new Promise(resolve => setTimeout(resolve, 100));
    router.push('/?profile=True');
  };

  return (
    <form method="POST" onSubmit={onSubmit} className="relative h-full w-full text-gray-500">
      <div className="flex flex-row bg-gray-900 rounded-md w-full justify-between items-center p-4">
        <div className="relative flex flex-row justify-between w-full">
          <div className="w-full flex flex-col gap-y-1 leading-3 justify-center h-20">
            <div className="flex flex-row justify-start items-center gap-x-2">
              <span className="text-gray-400 my-1 text-xs uppercase">Retirar Fondos</span>
              { success && (<div className="text-lime-400 text-xs">{success}</div>)}
              { error && (<div className="text-red-400 text-xs">{error}</div>)}
            </div>
            <div className="relative h-8 w-full">
              <div className="absolute text-gray-500 text-lg top-2/4 left-2 grid h-5 w-5 -translate-y-2/4 items-center"><FiDollarSign/></div>
              <input className="h-full w-full indent-4 text-gray-200 rounded-sm border border-gray-800 bg-transparent px-3 py-2 !pr-9 text-sm outline outline-0 transition-all focus:outline-0 disabled:border-0"
                  type="number"
                  name="amount"
                  value={amount}
                  onChange={(e) => onChange(e)}
                  min="1"
                  max="9999"
                  pattern="[0-9]*"
                  required
                  readOnly={registrationSuccess}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full h-full mt-2 mb-2 gap-y-2">
        {registrationSuccess ? (
          <p className="text-[0.55rem] text-gray-400 text-justify px-1">La Facturacion ha sido Exitosa! Los fondos seran transferidos a la cuenta configurada, veras reflejado el pago en las proxima 24 a 36 horas, identifica el pago con el codigo de referencia suministrado</p>
        ) : (
          <p className="text-[0.55rem] text-gray-400 text-justify px-1">Los fondos seran transferidos en un periodo de 24 a 36 Horas a la cuenta especificada a continuacion, al solicitar la transferencia reconoce y acepta que los datos suministrados son correctos</p>
        )}
        <div className="relative w-full flex items-center">
          <div className="absolute text-gray-400 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><RiBankCardFill/></div>
          <div className={`${registrationSuccess ? 'grid' : 'hidden' } absolute h-full text-gray-400 text-sm top-2/4 right-2 -translate-y-2/4 items-center`}> 
            <span className='border-l-gray-700 pl-2 border-l-2 h-full flex items-center text-gray-200 text-nowrap'>{withdraw}</span> 
          </div>
          <input className="w-full indent-8 text-gray-200 rounded-sm border border-gray-700 bg-transparent px-3 py-3 !pr-9 text-[0.7rem] outline outline-0 transition-all focus:outline-0 disabled:border-0 lg:text-xs"
            type="text"
            name="location"
            value={session?.user.billing ?? "Informacion Bancaria"}
            onChange={(e) => onChange(e)}
            required
            readOnly={true}
          />
        </div>
        {registrationSuccess ? (
          <p onClick={closeModal} className="w-full h-8 flex items-center justify-center text-center text-sm text-white font-semibold uppercase bg-green-500 rounded-sm py-2 px-4 md:mt-2">
            Solicitado
          </p>
        ) : (
          loading ? (
            <p className="w-full h-8 flex items-center justify-center text-center text-sm text-white font-semibold uppercase bg-blue-500 hover:bg-blue-600 rounded-sm py-2 px-4 md:mt-2">
              <CircleLoader loading={loading} size={25} color="#1c1d1f" />
            </p>
          ) : (
          session?.user.billing ? (
            <button type="submit" className="w-full h-8 flex items-center justify-center text-center text-sm text-white font-semibold uppercase bg-blue-500 hover:bg-blue-600 rounded-sm py-2 px-4 md:mt-2">
              Solicitar
            </button>
            ) : (
            <span onClick={openProfile} className="w-full h-8 flex items-center justify-center text-center text-sm text-white font-semibold uppercase bg-yellow-500 hover:bg-yellow-600 rounded-sm py-2 px-4 md:mt-2">
              Actualizar
            </span>
            )
          )
        )}
      </div>
    </form>
  );
};

export default WithdrawModal;
