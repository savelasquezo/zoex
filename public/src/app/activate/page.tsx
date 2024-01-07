'use client';
import React from 'react';
import Activation from './components/Activation';


export default function Page() {
  return (
    <main className='w-screen h-screen overflow-hidden bg-slate-800 flex flex-col items-center justify-center'>
      <div className="relative flex flex-col text-center text-gray-200 p-6 w-1/3 bg-slate-900 shadow-inner rounded-lg">
        <p className='px-4 text-lg'>¡Registro Exitoso!</p>
        <p className='px-4 text-xs'>Activa tu cuenta haciendo clic en el botón a continuación, seras redireccionado al inicio en unos segundos.</p>
        <div className='mt-4 w-full px-4'>
          <Activation/>
        </div>
      </div>
    </main>
  );
}
