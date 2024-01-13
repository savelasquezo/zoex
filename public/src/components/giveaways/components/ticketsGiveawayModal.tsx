import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { LuRefreshCw } from "react-icons/lu";
import Image from 'next/image';
import Link from 'next/link';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import CircleLoader from 'react-spinners/CircleLoader';

import { CiBank } from "react-icons/ci";

function getRandomTickets(aviableTickets: number[], num: number): number[] {
  const shuffledTickets = aviableTickets?.slice();
  let selectedTickets: number[] = [];

  while (selectedTickets.length < num && shuffledTickets.length > 0) {
    const randomIndex = Math.floor(Math.random() * shuffledTickets.length);
    selectedTickets.push(shuffledTickets[randomIndex]);
    shuffledTickets.splice(randomIndex, 1);
  }

  return selectedTickets;
}

interface TicketsGiveawayModalProps {
  closeModal: () => void;
  session: Session | null | undefined;
  giveawayId: number;
}

const TicketsGiveawayModal: React.FC<TicketsGiveawayModalProps> = ({ closeModal, session, giveawayId  }) => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [ticketsSuccess, setTicketsSuccess] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentInfo, setPaymentInfo] = useState('');
  
  const [loading, setLoading] = useState(false);

  const [invoice, setInvoice] = useState('');

  const [aviableTickets, setAviableTickets] = useState<string[]>([]);
  const [listTickets, setListTickets] = useState<string[]>([]);

  const [enteredLength, setEnteredLength] = useState<number>();
  const [generateNewNumbers, setGenerateNewNumbers] = useState<boolean>(true);

  const handleGenerateNewNumbers = () => {
    setGenerateNewNumbers(true);
  };

  const setNumber = (obj: string): void => {
    setFormData({
      ...formData,
      ticket: obj.toString(),
    });
  };

  useEffect(() => {
    const websocketURL = `${process.env.WEBSOCKET_APP}/ws/tickets_giveaway/${giveawayId}/`;
    const client = new W3CWebSocket(websocketURL);

    client.onmessage = (message) => {
      let data;
      if (typeof message.data === 'string') {
        data = JSON.parse(message.data);
      }

      setEnteredLength(data.iTickets[0]?.length); 
      if (generateNewNumbers) {
        const randomTickets = getRandomTickets(data.iTickets, 5);
        setAviableTickets(data.iTickets);
        setListTickets(randomTickets.map(String));
        setGenerateNewNumbers(false);
      }
    };

    return () => {
      if (client.readyState === client.OPEN) {
        client.close();
      }
    };
  }, [generateNewNumbers, giveawayId]);

  useEffect(() => {
    handleGenerateNewNumbers();
  }, []);

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

    const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
    if (!isEmailValid) {
      setError('¡Error - Ingrese un Email Valido!');
      setLoading(false);
      return;
    }

    const isTicketValid = /^[0-9]+$/.test(ticket);
    if (!isTicketValid && ticket === '') {
      setError('¡Error - Ingrese un Ticket Valido!');
      setLoading(false);
      return;
    }

    if (!paymentMethod) {
      setError('¡Error - Seleccione un Metodo de Pago!');
      setLoading(false);
      return;
    }

    if (!aviableTickets.includes(ticket)) {
      setError('¡Lamentablemente el Numero ya ha sido Adquirido! Intentalo Nuevamente');
      setLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/giveaway/request-ticketgiveaway/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({    
          email,
          paymentMethod,
          ticket,
          giveawayId,
        }),
      });
      const data = await res.json();
      if (!data.error) {
        setSuccess('¡Ya casi es tuyo! Confirma el pago y enviarmos el Ticket a tu Email');
        setInvoice(data.apiVoucher)
        setTicketsSuccess(true)
        setPaymentInfo(paymentMethod);
        if (session && session.user) {
          session.user.balance = data.newBalance;
        }
      }
      } catch (error) {
        return NextResponse.json({ error: 'There was an error with the network request' });
        
      } finally {
        setLoading(false);
    }
  };

  return (
    <div className='w-full h-full'>
      {!ticketsSuccess ? (
      <div className='w-full h-full inline-flex flex-col items-center justify-center my-2'>
        {listTickets.length > 0 ? (
        <div className='w-full h-full'>
          <div className='relative w-full h-full flex flex-row gap-x-4 justify-center bg-gray-900 shadow-current py-4 px-8 rounded-sm'>
            {listTickets.map((obj, i) => (
              <button key={i} onClick={() => setNumber(obj)} className='relative inline-flex justify-center items-center text-slate-900 bg-gradient-to-b from-yellow-200 to-yellow-500 rounded-full p-6'>
                <p className='absolute h-full w-full flex justify-center items-center text-lg uppercase font-semibold underline'>{obj}</p>
              </button>
            ))}
            <button onClick={handleGenerateNewNumbers} className='absolute top-2 right-2 bg-green-500 hover:bg-green-700 opacity-80 transition-colors duration-300 rounded-full p-1 h-6 text-white'><LuRefreshCw /></button>
          </div>
          <form>
            <div className='w-full flex flex-col justify-center items-center gap-y-2 my-1'>
              <div className='flex flex-col h-full w-full justify-center items-center gap-y-2 px-2'>
                <input className='w-full rounded-sm bg-slate-900 text-gray-200 text-center border-none appearance-none focus:!appearance-none outline-0 ring-0 focus:!ring-0 focus:outline-0 disabled:border-0'
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => onChange(e)}
                  required
                  placeholder="Email"
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"
                  readOnly={ticketsSuccess || !!session?.user?.email}     
                />
                <input className='w-full rounded-sm bg-slate-900 text-gray-400 text-center border-none appearance-none focus:!appearance-none outline-0 ring-0 focus:!ring-0 focus:outline-0 disabled:border-0'
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
                <div className="relative flex flex-wrap gap-x-2 my-4">
                  <span onClick={() => {if (paymentMethod === 'crypto') {setPaymentMethod('');} else {setPaymentMethod('crypto');}}} className=""><Image unoptimized width={405} height={200} src={"/assets/image/bitcoin.webp"} className={`rounded-lg shadow-inherit h-10 w-20 object-fit hover:scale-[1.05] transition-transform duration-300  ${paymentMethod === 'crypto' ? 'opacity-100' : 'opacity-80'}`} alt="" /></span>
                  <span onClick={() => {if (paymentMethod === 'bank') {setPaymentMethod('');} else {setPaymentMethod('bank');}}} className=""><Image unoptimized width={405} height={200} src={"/assets/image/bank.webp"} className={`rounded-lg shadow-inherit h-10 w-20 object-fit hover:scale-[1.05] transition-transform duration-300" ${paymentMethod === 'bank' ? 'opacity-100' : 'opacity-80'}`} alt="" /></span>
                  <span onClick={() => {if (paymentMethod === 'paypal') {setPaymentMethod('');} else {setPaymentMethod('paypal');}}} className=""><Image unoptimized width={405} height={200} src={"/assets/image/paypal.webp"} className={`rounded-lg shadow-inherit h-10 w-20 object-fit hover:scale-[1.05] transition-transform duration-300" ${paymentMethod === 'paypal' ? 'opacity-100' : 'opacity-80'}`} alt="" /></span>
                  <span onClick={() => {if (paymentMethod === 'nequi') {setPaymentMethod('');} else {setPaymentMethod('nequi');}}} className=""><Image unoptimized width={405} height={200} src={"/assets/image/nequi.webp"} className={`rounded-lg shadow-inherit h-10 w-20 object-fit hover:scale-[1.05] transition-transform duration-300" ${paymentMethod === 'nequi' ? 'opacity-100' : 'opacity-80'}`} alt="" /></span>
                  <span onClick={() => {if (paymentMethod === 'daviplata') {setPaymentMethod('');} else {setPaymentMethod('daviplata');}}} className=""><Image unoptimized width={405} height={200} src={"/assets/image/daviplata.webp"} className={`rounded-lg shadow-inherit h-10 w-20 object-fit hover:scale-[1.05] transition-transform duration-300" ${paymentMethod === 'daviplata' ? 'opacity-100' : 'opacity-80'}`} alt="" /></span>
                </div>
              </div>
              {loading ? (
                <button type="button" className='w-32 h-8 flex justify-center items-center text-white bg-blue-600 hover:bg-blue-700 transition duration-300 focus:outline-none font-medium rounded-sm text-sm px-5 py-1 text-center uppercase'><CircleLoader loading={loading} size={16} color="#1c1d1f" /></button>
              ) : (
                <input onClick={handleSubmit} type="submit" value="Comprar" className='w-32 h-8 text-gray-900 bg-zinc-300 hover:bg-zinc-200 transition duration-300 focus:outline-none font-medium rounded-sm text-sm px-5 py-1 text-center uppercase'/>
              )}
            </div>
          </form>
          {error && (<div className="text-red-400 text-sm mt-2">{error}</div>)}
          {!error && !success && (<div className="text-gray-400 text-xs mt-2 h-6">¿Necesitas Ayuda? support@zoexwin.com</div>)}
        </div>
        ) : (
        <div className='w-full h-full flex flex-col justify-start items-center'>
          <span className='text-center text-gray-300 my-4 text-sm'>
              <p>¡No hay Tickets disponibles para este Sorteo!</p>
              <p>El Sorteo se realizara el proximo dia 15</p>
          </span>
        </div>
        )}
      </div>
      ) : (
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
        <div className={`flex flex-col justify-center items-center gap-y-4 ${paymentInfo !== '' ? 'block' : 'hidden' }`}>
          {success && (<div className="text-lime-400 text-sm mt-2">{success}</div>)}
          <div className={`flex flex-col justify-center items-center leading-none ${paymentInfo === 'crypto' ? 'block' : 'hidden' }`}>
            <Link href={`https://confirmo.net/public/invoice/${invoice}`} target="_blank" rel="noopener noreferrer">
              <Image unoptimized width={192} height={128} src={"/assets/image/pyment-crypto.webp"} className={`rounded-lg shadow-inherit h-10 w-22 object-fit hover:shadow-lg transition duration-300`} alt="" />
            </Link>
          </div>
          <div className={`flex flex-col justify-center items-center leading-none ${paymentInfo === 'bank' ? 'block' : 'hidden' }`}>
            <div className="flex flex-row gap-x-2 justify-start items-center">
              <div className="text-xs text-white flex flex-row items-center bg-gray-900 rounded-sm py-2 px-2 h-10">
                <span className="text-4xl text-gray-400"><CiBank /></span>
                <div className="flex flex-col ml-2">
                  <p>Bancolombia -Ahorros</p>
                  <p>4545745-5353</p>
                </div>
              </div>
              <div className="text-xs text-white flex flex-row items-center bg-gray-900 rounded-sm py-2 px-2 h-10">
                <span className="text-4xl text-gray-400"><CiBank /></span>
                <div className="flex flex-col ml-2">
                  <p>Davivienda -Ahorros</p>
                  <p>4545745-5353</p>
                </div>
              </div>
            </div>
          </div>
          <div className={`flex flex-col justify-center items-center leading-none ${paymentInfo === 'paypal' ? 'block' : 'hidden' }`}>
            <Link href={`https://www.paypal.com/`} target="_blank" rel="noopener noreferrer">
              <Image unoptimized width={192} height={128} src={"/assets/image/pyment-paypal.webp"} className={`rounded-lg shadow-inherit h-10 w-22 object-fit hover:shadow-lg transition duration-300`} alt="" />
            </Link>
          </div>
          <div className={`flex flex-col leading-none ${paymentInfo === 'nequi' ? 'block' : 'hidden' }`}>
            <div className="text-xs text-white flex flex-row items-center bg-gray-900 rounded-sm py-2 px-2 h-10">
              <span className="text-4xl text-gray-400"><CiBank /></span>
              <div className="flex flex-col ml-2">
                <p>Nequi</p>
                <p>4545745-5353</p>
              </div>
            </div>
          </div>
          <div className={`flex flex-col justify-center items-center leading-none ${paymentInfo === 'daviplata' ? 'block' : 'hidden' }`}>
            <div className="text-xs text-white flex flex-row items-center bg-gray-900 rounded-sm py-2 px-2 h-10">
              <span className="text-4xl text-gray-400"><CiBank /></span>
              <div className="flex flex-col ml-2">
                <p>Daviplata</p>
                <p>4545745-5353</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex flex-col bottom-2 w-full justify-center items-center gap-y-4">
            <button type="button" onClick={handleSubmit} className='w-32 h-8 text-white bg-green-600 hover:bg-green-700 transition duration-300 focus:outline-none font-medium rounded-sm text-sm px-5 py-1 text-center uppercase'>Aceptar</button>
            <p className='text-center text-xs text-gray-400'>Incluye en la descripción el código de compra, El tiempo de confirmación es de 24 a 36 horas<br /> 
            ¿Necesitas Ayuda? support@zoexwin.com</p>
          </div>
      </div>
      )}
    </div>
  );
};

export default TicketsGiveawayModal;
