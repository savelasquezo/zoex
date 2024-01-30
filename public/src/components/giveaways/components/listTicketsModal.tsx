import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { NextResponse } from 'next/server';

import { GoAlertFill } from "react-icons/go";
import { FaCheckCircle } from "react-icons/fa";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

interface ListTicketsGiveawayModalProps {
  closeModal: () => void;
  session: Session | null | undefined;
  giveawayId: string;
}

type TicketType = {
    id: number;
    ticket: string;
    date: string;
    voucher: string;
    is_active: boolean;
    giveaway: number;
    email: any;
    giveawayID: string;
};

export const fetchGiveawayTickets = async (accessToken: any, giveawayId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/giveaway/fetch-giveaway-tickets/${giveawayId}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${accessToken}`,
          },
        },
      );
      if (!res.ok) {
        return NextResponse.json({ error: 'Server responded with an error' });
      }
      const data = await res.json();
      return data;
    } catch (error) {
      return NextResponse.json({ error: 'There was an error with the network request' });
    }
  }

const ListTicketsGiveawayModal: React.FC<ListTicketsGiveawayModalProps> = ({ closeModal, session, giveawayId  }) => {

    const [pageNumber, setPageNumber] = useState(0);
    const TicketsPage = 5;

    const [ticketList, setTicketList] = useState<TicketType[]>([]);
    const pageCount = Math.ceil(ticketList.length) / TicketsPage;
    const changePage = ({ selected }: { selected: number }) => {
        setPageNumber(selected);
        };

    useEffect(() => {
        const fetchData = async () => {
            if (session) {
                const accessToken = session?.user?.accessToken;
                try {
                    const TicketsList = await fetchGiveawayTickets(accessToken, giveawayId);
                    setTicketList(TicketsList || []);
                    
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };
        
        fetchData();
    }, [session]);

    const router = useRouter();
    const openLogin = () => {
        closeModal()
        router.push('/?login=True');
    };

    return (
        <div className='w-full h-full mt-10'>
            <div className="relative h-[calc(100%-4rem)] w-full text-gray-500">
                {session && session?.user? (
                ticketList.length > 0 ? (
                <div>
                    <ul>
                        <table className="min-w-full text-center text-sm font-light">
                            <thead className="font-medium text-white">
                                <tr className="border-b border-slate-900 uppercase text-xs">
                                    <th scope="col" className=" px-6 py-2">Ticket</th>
                                    <th scope="col" className=" px-6 py-2 hidden lg:table-cell">Sorteo</th>
                                    <th scope="col" className=" px-6 py-2">PIN</th>
                                    <th scope="col" className=" px-6 py-2 hidden sm:table-cell">Fecha</th>
                                    <th scope="col" className=" px-6 py-2"></th>
                                </tr>
                            </thead>
                            {ticketList?.slice(pageNumber * TicketsPage, (pageNumber + 1) * TicketsPage).map((obj, index) => (
                                <tr key={index} className="border-b border-slate-700 uppercase text-xs text-white">
                                    <td className="whitespace-nowrap px-6 py-2 font-Courier font-semibold">{obj.ticket}</td>
                                    <td className="whitespace-nowrap px-6 py-2 hidden lg:table-cell">{obj.giveawayID}</td>
                                    <td className="whitespace-nowrap px-6 py-2">{obj.voucher}</td>
                                    <td className="whitespace-nowrap px-6 py-2 hidden sm:table-cell">{obj.date}</td>
                                    <td className="whitespace-nowrap px-6 py-2 flex justify-center">
                                        {obj.is_active ? <p className='text-green-300'><FaCheckCircle /></p> : <p className='text-yellow-300'><GoAlertFill /></p>}
                                    </td>
                                </tr>
                            ))}
                        </table>
                    </ul>
                    <ReactPaginate
                        previousLabel={<MdNavigateBefore/>}
                        nextLabel={<MdNavigateNext/>}
                        breakLabel={'...'}
                        pageCount={pageCount}
                        marginPagesDisplayed={0}
                        pageRangeDisplayed={5}
                        onPageChange={changePage}
                        className={'absolute bottom-5 w-full flex flex-row items-center justify-center gap-x-2'}
                        pageClassName={'bg-slate-700 rounded-full !px-3 !py-0 transition-colors duration-300'}
                        activeClassName={'bg-slate-600 text-slate-600 rounded-full !px-3 !py-0 transition-colors duration-300'}
                        previousClassName={'absolute left-5 bg-slate-700 rounded-full p-1 transition-colors duration-300'}
                        nextClassName={'absolute right-5 bg-slate-700 rounded-full p-1 transition-colors duration-300'}
                    />
                </div>
                ) : (
                <div className='w-full h-full flex flex-col justify-start items-center'>
                    <span className='text-center text-gray-300 my-4 text-sm'>
                        <p>¡Aun No has adquirido ningun ticket para esta Loteria!</p>
                        <p>Adquierlo ahora y participa en el siguiente Sorteo</p>
                    </span>
                </div>
                )
                ) : (
                <div className='w-full h-full flex flex-col justify-start items-center'>
                    <span className='text-center text-gray-300 my-4 text-sm'>
                        <p>¡Requerido Inicio de Sesion!</p>
                        <p>El Historial de Ticket solo esta disponible para usuarios registrados</p>
                    </span>
                    <button onClick={openLogin} className="w-1/4 bg-red-500 hover:bg-red-700 text-white text-sm font-semibold py-1 px-2 rounded transition-colors duration-300">Ingresar</button>
                </div>
                )}
            </div>
        </div>
    );
};

export default ListTicketsGiveawayModal;
