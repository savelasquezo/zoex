import Activation from './components/Activation';

export default function Page() {
  return (
    <main className='w-screen h-screen overflow-hidden bg-slate-800 flex flex-col items-center justify-center'>
      <div className="relative flex flex-col text-center text-gray-200 py-4 h-48 w-1/3 bg-slate-900 shadow-inner rounded-lg">
        <p className='mt-2 px-4 text-lg'>¡Gracias por registrarte!</p>
        <p className='mt-2 px-4 text-sm'>Activa tu cuenta haciendo clic en el botón a continuación, seras redireccionado al inicio</p>

        <div className='absolute bottom-4 w-full px-4'>
          <Activation/>
        </div>
      </div>
    </main>
  );
}
