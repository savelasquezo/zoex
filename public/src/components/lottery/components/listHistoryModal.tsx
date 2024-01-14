import React, { useEffect, useState } from 'react';
import { NextResponse } from 'next/server';
import ReactPaginate from 'react-paginate';
import { Session } from 'next-auth';


import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { FaLink } from "react-icons/fa6";



interface ListHistoryLotteryModalProps {
  closeModal: () => void;
  session: Session | null | undefined;
}

type TicketType = {
    lottery: string;
    date_results: string;
    winner: string;
    stream: string;
};


export const fetchLotteryHistory = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/api/lottery/fetch-lottery-history/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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

const ListHistoryLotteryModal: React.FC<ListHistoryLotteryModalProps> = ({ closeModal, session  }) => {

    const [pageNumber, setPageNumber] = useState(0);
    const HisotryPage = 5;

    const [hisotryList, setHisotryList] = useState<TicketType[]>([]);
    const pageCount = Math.ceil(hisotryList.length) / HisotryPage;
    const changePage = ({ selected }: { selected: number }) => {
        setPageNumber(selected);
        };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const HisotryList = await fetchLotteryHistory();
                setHisotryList(HisotryList || []);
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [session]);


    return (
        <div className='w-full h-full mt-10'>
            {hisotryList.length > 0 ? (
                <div className="relative h-[calc(100%-4rem)] w-full text-gray-500">
                    <ul>
                        <table className="min-w-full text-center text-sm font-light">
                            <thead className="font-medium text-white">
                                <tr className="border-b border-slate-900 uppercase text-xs">
                                    <th scope="col" className=" px-6 py-2">Loteria</th>
                                    <th scope="col" className=" px-6 py-2">Fecha</th>
                                    <th scope="col" className=" px-6 py-2">Ticket</th>
                                    <th scope="col" className=" px-6 py-2">Link</th>
                                </tr>
                            </thead>
                            {hisotryList?.slice(pageNumber * HisotryPage, (pageNumber + 1) * HisotryPage).map((obj, index) => (
                                <tr key={index} className="border-b border-slate-700 uppercase text-xs text-white">
                                    <td className="whitespace-nowrap px-6 py-2 font-Courier font-semibold">{obj.lottery}</td>
                                    <td className="whitespace-nowrap px-6 py-2">{obj.date_results}</td>
                                    <td className="whitespace-nowrap px-6 py-2">{obj.winner}</td>
                                    <td className="whitespace-nowrap px-6 py-2 flex justify-center">
                                        <a href={obj.stream} target='blank' className='hover:text-blue-500 transition-colors duration-300'><FaLink /></a>
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
                    nextClassName={'absolute right-5 bg-slate-700 rounded-full p-1 transition-colors duration-300'} />
                </div>
                ) : (
                <div className='w-full h-full flex flex-col justify-start items-center'>
                    <span className='text-center text-gray-300 my-4 text-sm'>
                        <p>¡Aun No hay Historial disponible para esta Loteria!</p>
                        <p>La Loteria se realizara el proximo dia 15</p>
                    </span>
                </div>
            )}
        </div>
    );
};

export default ListHistoryLotteryModal;
