import React, { useEffect, useState, Suspense } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { NextResponse } from 'next/server';
import Image from 'next/image';
import CircleLoader from 'react-spinners/CircleLoader';

import { getRandomTickets } from '@/utils/getRandomTickets'
import { LuRefreshCw } from "react-icons/lu";

interface TicketsLotteryModalProps {
  closeModal: () => void;
  session: Session | null | undefined;
}

interface LotteryData {
  id: number;
  file: string;
  lottery: string;
  prize: number;
  tickets: number;
  price: number;
  winner: null,
  date_lottery: string;
  sold: number;
  date_results: string;
  stream: null,
  amount: number;
}

const TicketsLotteryModal: React.FC<TicketsLotteryModalProps> = ({ closeModal, session  }) => {

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [lottery, setLottery] = useState<LotteryData>();

  const [invoice, setInvoice] = useState('');
  const [ticketsSuccess, setTicketsSuccess] = useState(false);

  const [listTickets, setListTickets] = useState<string[]>([]);
  const [aviableTickets, setAviableTickets] = useState<string[]>([]);

  const [enteredLength, setEnteredLength] = useState<number>();
  const [generateNewNumbers, setGenerateNewNumbers] = useState<boolean>(true);

  const handleGenerateNewNumbers = (): void => {
    setGenerateNewNumbers(true);
  };

  const setNumber = (obj: string): void => {
    setFormData({
      ...formData,
      ticket: obj.toString(),
    });
  };

  useEffect(() => {
    const websocketURL = `${process.env.NEXT_PUBLIC_WEBSOCKET_APP}/app/ws/tickets_lottery/`;
    const client = new W3CWebSocket(websocketURL);

    client.onmessage = (message) => {
      let data;
      try {
        data = JSON.parse(message.data as string);
  
        if (data.tickets && data.tickets.length > 0 && data.tickets[0]) {
          setEnteredLength(data.tickets[0].length);
        }
  
        if (generateNewNumbers) {
          const randomTickets = getRandomTickets(data.tickets, 5);
          setAviableTickets(data.tickets);
          setLottery(data.lottery);
          setListTickets(randomTickets.map(String));
          setGenerateNewNumbers(false);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    return () => {
      if (client.readyState === client.OPEN) {
        client.close();
      }
    };
  }, [generateNewNumbers]);

  const [formData, setFormData] = useState({
    email: session?.user?.email || '',
    ticket: '',
  });

  const {ticket, email } = formData;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!session?.user) {
      setError('¡Error - Requerido Inicio de Session!');
      setLoading(false);
      return;
    }

    if (!lottery) {
      setError('¡Error Inesperado! Intentelo Nuevamente');
      setLoading(false);
      return;
    }

    if ((session.user.balance < lottery.price) && (session.user.credits < lottery.price)) {
      setError('¡Saldo Insuficiente!');
      setLoading(false);
      return;
    }
    
    if (ticketsSuccess) {
      setGenerateNewNumbers(true);
      setTicketsSuccess(false)
      setFormData({
        ...formData,
        ticket: '',
      });
      setLoading(false);
      return
    }

    const isTicketValid = /^[0-9]+$/.test(ticket.toString());
    if (!isTicketValid && ticket === '') {
      setError('¡Error - Ingrese un Ticket Valido!');
      setLoading(false);
      return;
    }

    if (!aviableTickets.includes(ticket)) {
      setError('¡Lamentablemente el Numero ya ha sido Adquirido!');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/lottery/request-ticketlottery/`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({    
          email,
          ticket,
        }),
      });
      
      const data = await res.json();
      if (!data.error) {
        setSuccess('¡Adquirido! Enviamos el Ticket a tu Email');
        setInvoice(data.apiVoucher)
        setTicketsSuccess(true)
        if (session && session.user) {
          session.user.balance = data.newBalance;
        }
      }
    } catch (error) {
      return NextResponse.json({ error: 'There was an error with the network request' });

    } finally {
      handleGenerateNewNumbers();
      setLoading(false);
    }
  };

  const openLogin = () => {
    closeModal()
    router.push('/?login=True');
  };

  return (
    <div className='w-full h-[22rem]'>
      {(!ticketsSuccess && lottery)? (
        <div className='w-full h-[22rem] flex flex-col py-2'>
          {listTickets.length > 0 ? (
          <div className='w-full flex flex-col-reverse items-start justify-start lg:flex-row lg:justify-center animate-fade-in animate__animated animate__fadeIn'>
            <form method="POST" onClick={handleSubmit} className='w-full flex flex-col justify-start items-start gap-y-2 my-6 py-6 lg:w-2/5 lg:items-center'>
                <div className='relative flex flex-col w-full h-32 justify-start items-center lg:h-52 lg:justify-center'>
                  <div className='absolute -top-12 right-0 md:right-12 lg:hidden'>
                    <span className='relative h-full w-full flex items-center'>
                      <Image width={256} height={256} src={"/assets/image/glump.webp"} alt="" className="w-auto h-20"/>
                      <p className='absolute text-center text-3xl z-20 right-1/4 font-semibold text-slate-800'>${lottery.price}</p>
                    </span>
                  </div>
                  <Image width={400} height={400} src={"/assets/image/ball.webp"} alt="" className="absolute h-40 w-auto object-cover z-10 -mt-12 lg:h-48 lg:mt-0"/>
                  <input className='absolute !bg-transparent text-gray-600 font-semibold text-5xl text-center border-none appearance-none outline-0 z-20'
                    type="text"
                    name="ticket"
                    id="ticket"
                    minLength={enteredLength}
                    maxLength={enteredLength}
                    value={ticket}
                    onChange={(e) => onChange(e)}
                    readOnly={ticketsSuccess}
                    required
                  />
                </div>
                {loading ? (
                  <button type="button" className='w-full h-8 flex justify-center items-center text-white bg-blue-600 hover:bg-blue-700 transition duration-300 focus:outline-none font-medium rounded-sm text-sm px-5 py-1 text-center uppercase lg:w-40'><CircleLoader loading={loading} size={16} color="#1c1d1f" /></button>
                ) : (
                  session && session?.user? (
                    <input type="submit" value="Comprar" className='w-full h-8 text-gray-900 bg-zinc-300 hover:bg-zinc-200 transition duration-300 focus:outline-none font-medium rounded-sm text-sm px-5 py-1 text-center uppercase lg:w-40'/>
                    ) : (
                    <span onClick={openLogin} className="w-full h-8 flex justify-center items-center bg-red-500 hover:bg-red-700 text-white text-sm font-semibold py-1 px-2 rounded transition-colors duration-300 lg:w-40">Ingresar</span>
                  )
                )}
            </form>
            <div className='w-full flex flex-col justify-start items-center gap-y-2 my-4 lg:w-3/5 lg:my-10'>
              <div className='relative w-full h-auto flex flex-row gap-x-2 md:gap-x-4 justify-center bg-gray-900 shadow-current py-4 px-8 rounded-sm'>
                {listTickets.map((obj, i) => (
                  <button key={i} onClick={() => setNumber(obj)} className='relative inline-flex justify-center items-center text-slate-900 bg-gradient-to-b from-yellow-200 to-yellow-500 rounded-full p-4 md:p-6'>
                    <p className='absolute h-full w-full flex justify-center items-center text-xs md:text-lg uppercase font-normal md:font-semibold underline'>{obj}</p>
                  </button>
                ))}
                {generateNewNumbers ? (
                  <button type="button" className='p-1 h-5 text-xs absolute scale-75 top-1 md:top-2 right-1 md:right-2 bg-green-500 hover:bg-green-700 opacity-80 transition-colors duration-300 rounded-full text-white lg:h-6 lg:text-base lg:scale-100 '><CircleLoader size={16} /></button>
                ) : (
                  <button onClick={handleGenerateNewNumbers} className='p-1 h-5 text-xs absolute scale-75 top-1 md:top-2 right-1 md:right-2 bg-green-500 hover:bg-green-700 opacity-80 transition-colors duration-300 rounded-full text-white lg:h-6 lg:text-base lg:scale-100 '><LuRefreshCw /></button>
                )}
              </div>
              {lottery? (
              <div className='relative w-full h-36 gap-y-0.5 px-4 my-4 hidden lg:flex lg:flex-col lg:justify-start'>
                <div className='flex flex-row justify-between items-center'>
                  <p className='text-gray-400 text-xs'>Loteria: {lottery.lottery}</p>
                  <p className='text-gray-400 text-xs'>Fecha: {lottery.date_lottery}</p>
                </div >
                <div className='flex flex-row justify-between items-center'>
                  <p className='text-gray-400 text-xs'>Disponibles: {lottery.tickets - lottery.sold}/{lottery.tickets}</p>
                  <p className='text-gray-400 text-xs'>Acumulado: ${lottery.prize}</p>
                </div >
                <p className='text-gray-400 text-xs mt-4 text-justify'>¡Adquierelo Ahora! Tu Boleta sera validad para este sorteo hasta que este tenga un ganador, compra ahora tus numeros de la suerte.</p>
                <div className='absolute w-full bottom-0 flex items-center h-6'>
                  {error && (<div className="text-red-400 text-sm mt-2 h-6">{error}</div>)}
                  {!error && !success && (<div className="text-gray-400 text-xs mt-2 h-6">¿Necesitas Ayuda? support@zoexbet.com</div>)}
                </div>
                <div className='absolute -bottom-8 right-8'>
                    <span className='relative h-full w-full flex items-center'>
                      <Image width={256} height={256} src={"/assets/image/glump.webp"} alt="" className="w-auto h-20"/>
                      <p className='absolute text-center text-3xl z-20 right-1/4 font-semibold text-slate-800'>${lottery.price}</p>
                    </span>
                  </div>
              </div>
              ) : (
                null
              )}
            </div>
            <div className='flex absolute bottom-3 left-0 items-center h-6 w-full sm:bottom-1 lg:hidden'>
              {error && (<p className="text-red-400 text-xs mt-2 h-6 text-center w-full">{error}</p>)}
              {!error && !success && (<p className="text-gray-400 text-xs mt-2 h-6 text-center w-full">¿Necesitas Ayuda? support@zoexbet.com</p>)}
            </div>
          </div>
          ) : (
          <div className='w-full h-full flex flex-col justify-start items-center mt-8'>
            <span className='text-center text-gray-300 my-4 text-sm'>
                <p>¡No hay Tickets disponibles para este Sorteo!</p>
                <p>El Sorteo se realizara el proximo dia 15</p>
            </span>
          </div>
          )}
        </div>
      ) : (ticketsSuccess && lottery)? (
        <div className='relative w-full h-80 flex flex-col items-center justify-start mt-8'>
          <div className='flex flex-row gap-x-4 w-96 justify-start bg-gray-900 shadow-current py-4 px-8 rounded-sm'>
            <span className='relative inline-flex justify-center items-center text-slate-900 bg-gradient-to-b from-yellow-200 to-yellow-500 rounded-full p-6'>
              <p className='absolute h-full w-full flex justify-center items-center text-lg uppercase font-semibold underline'>{ticket}</p>
            </span>
            <div className='flex flex-col ml-1'>
              <p className='text-gray-400 text-xs'>email: {email}</p>
              <p className='text-gray-400 text-xs'>Voucher: {invoice}</p>
            </div>
          </div>
          <div className="absolute flex flex-col bottom-2 w-full justify-center items-center gap-y-4">
              <button type="button" onClick={handleSubmit} className='w-32 h-8 text-white bg-green-600 hover:bg-green-700 transition duration-300 focus:outline-none font-medium rounded-sm text-sm px-5 py-1 text-center uppercase'>Aceptar</button>
            </div>
        </div>
      ) : (
        <p>...</p>
      )}
    </div>
  );
};

export default TicketsLotteryModal;
