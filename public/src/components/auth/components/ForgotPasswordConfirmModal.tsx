import React, { useState } from 'react';
import { NextResponse } from 'next/server';

import CircleLoader from 'react-spinners/CircleLoader';
import { useRouter, useSearchParams } from 'next/navigation';
import { validatePassword } from "../../../utils/passwordValidation";

import {FiLock} from 'react-icons/fi'

type ForgotPasswordConfirmModalProps = {
  closeModal: () => void;
  updateForgotPasswordModalState: (value: boolean) => void;
};


const ForgotPasswordConfirmModal: React.FC<ForgotPasswordConfirmModalProps> = ({ closeModal, updateForgotPasswordModalState }) => {

  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = searchParams.get('token');
  const uid = searchParams.get('uid');

  const [formData, setFormData] = useState({
    new_password: '',
    re_new_password: '',
  });

  const { new_password, re_new_password } = formData;
  const onChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);
  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const passwordValidationResult = validatePassword(new_password);
    if (passwordValidationResult) {
      setError(passwordValidationResult);
      setLoading(false);
      return;
    }

    if (new_password !== re_new_password) {
      setError('¡Contraseñas Inconsistentes!');
      setLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/auth/users/reset_password_confirm/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          token,
          new_password,
          re_new_password,
        }),
      });
      
      if (res.ok) {
        setChangePasswordSuccess(true);
        updateForgotPasswordModalState(false);
        setSuccess('¡Contraseña Actualizada!');
        NextResponse.json({ success: 'Password reset successfully' });
      }

    } catch (error) {
        setChangePasswordSuccess(false);
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
            <div className="absolute text-gray-500 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><FiLock/></div>
            <input className="h-full w-full indent-8 text-gray-200 rounded-lg border border-gray-700 focus:border-gray-700 bg-transparent px-3 py-2 !pr-9 text-sm outline outline-0 ring-0 focus:!ring-0 focus:outline-0 disabled:border-0"
                type="password"
                name="new_password"
                value={new_password}
                onChange={(e) => onChange(e)}
                required
                placeholder="Contraseña"
                disabled={changePasswordSuccess}
            />
        </div>
        <div className="relative h-12 w-full min-w-[200px]">
            <div className="absolute text-gray-500 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><FiLock/></div>
            <input className="h-full w-full indent-8 text-gray-200 rounded-lg border border-gray-700 focus:border-gray-700 bg-transparent px-3 py-2 !pr-9 text-sm outline outline-0 ring-0 focus:!ring-0 focus:outline-0 disabled:border-0"
                type="password"
                name="re_new_password"
                value={re_new_password}
                onChange={(e) => onChange(e)}
                required
                placeholder="Contraseña"
                disabled={changePasswordSuccess}
            />
        </div>
        {changePasswordSuccess ? (
          <button className="bg-green-500 text-white font-semibold rounded-md py-2 px-4 w-full text-sm text-center uppercase"
            onClick={() => {closeModal();router.push('/');}}>
            Actualizado
          </button>
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

export default ForgotPasswordConfirmModal;