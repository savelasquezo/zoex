import React, { useEffect, useState } from 'react';

import ReactPaginate from 'react-paginate';
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

import { useRouter } from 'next/navigation';

import { Session } from 'next-auth';
import { fetchGiveawayTickets } from '@/app/api/tickets/giveaway/route';

import { GoAlertFill } from "react-icons/go";
import { FaCheckCircle } from "react-icons/fa";

interface ListTicketsGiveawayModalProps {
  closeModal: () => void;
  session: Session | null | undefined;
  giveawayId: number;
}

type TicketType = {
    ticket: string;
    date: string;
    method: string;
    voucher: string;
    is_active: boolean;
};

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
                const accessToken = session.user.accessToken;
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
                                    <th scope="col" className=" px-6 py-2">Fecha</th>
                                    <th scope="col" className=" px-6 py-2">Metodo</th>
                                    <th scope="col" className=" px-6 py-2">Voucher</th>
                                    <th scope="col" className=" px-6 py-2">Estado</th>
                                </tr>
                            </thead>
                            {ticketList?.slice(pageNumber * TicketsPage, (pageNumber + 1) * TicketsPage).map((obj, index) => (
                                <tr key={index} className="border-b border-slate-700 uppercase text-xs text-white">
                                    <td className="whitespace-nowrap px-6 py-2 font-Courier font-semibold">{obj.ticket}</td>
                                    <td className="whitespace-nowrap px-6 py-2">{obj.date}</td>
                                    <td className="whitespace-nowrap px-6 py-2">{obj.method}</td>
                                    <td className="whitespace-nowrap px-6 py-2">{obj.voucher}</td>
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
                        pageClassName={'bg-slate-700 text-slate-700 rounded-full !px-3 !py-0 transition-colors duration-300'}
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
