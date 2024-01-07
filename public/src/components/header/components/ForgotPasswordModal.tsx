import React, { useState } from 'react';
import CircleLoader from 'react-spinners/CircleLoader';
import { NextResponse } from 'next/server';

import {CiMail} from 'react-icons/ci'

type ForgotPasswordModalProps = {
  closeModal: () => void;
};


const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ closeModal }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
  });

  const { email } = formData;

  const onChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/auth/users/reset_password/`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (res.status !== 200) {
        return setError("¡Email no fue Encontrado! ");
      }
      
      setSuccess("¡Enviamos un Correo Electronio de Restablecimiento! ");
      setRegistrationSuccess(true);

      } catch (error) {
        setError('¡Error al Actualizar! Inténtalo Nuevamente!');
        NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit} method="POST" className="flex flex-col gap-y-4 p-2">
        <div className="relative h-12 w-full min-w-[200px]">
            <div className="absolute text-gray-500 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><CiMail/></div>
            <input className="h-full w-full indent-8 text-gray-200 rounded-lg border border-gray-700 focus:border-gray-700 bg-transparent px-3 py-2 !pr-9 text-sm outline outline-0 ring-0 focus:!ring-0 focus:outline-0 disabled:border-0"
                type="text"
                name="email"
                value={email}
                onChange={(e) => onChange(e)}
                required
                placeholder="Email"
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"
                disabled={registrationSuccess}
            />
        </div>
        {registrationSuccess ? (
          <p onClick={closeModal} className="bg-green-500 text-white font-semibold rounded-md py-2 px-4 w-full text-sm text-center uppercase">
            Verificar email
          </p>
          ) : (
          loading ? (
            <button type="button" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full text-center flex items-center justify-center">
              <CircleLoader loading={loading} size={25} color="#1c1d1f" />
            </button>
            ) : (
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full text-center">Restablecer</button>
          )
        )}
      </form>
      { success && (<div className="text-lime-400 text-sm mt-2">{success}</div>)}
      { error && (<div className="text-red-400 text-sm mt-2">{error}</div>)}
      { !error && !success && (<div className="text-gray-400 text-xs mt-2 h-6">¿Necesitas Ayuda? support@zoexwin.com</div>)}
  </div>
  );
};

export default ForgotPasswordModal;
