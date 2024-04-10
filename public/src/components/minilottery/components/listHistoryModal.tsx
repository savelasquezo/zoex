import React, { useEffect, useState } from 'react';
import { NextResponse } from 'next/server';
import ReactPaginate from 'react-paginate';

import { SessionModal, MiniLotteryData } from '@/lib/types/types';

import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { GiCheckMark , GiCrossMark } from "react-icons/gi";
import { FaLink } from "react-icons/fa6";

export const fetchMiniLotteryHistory = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/app/minilottery/fetch-minilottery-history/`,
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
      return NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
    }
}

const ListHistoryMiniLotteryModal: React.FC<SessionModal> = ({ closeModal, session  }) => {

    const [pageNumber, setPageNumber] = useState(0);
    const HisotryPage = 5;

    const [hisotryList, setHisotryList] = useState<MiniLotteryData[]>([]);
    const pageCount = Math.ceil(hisotryList.length/HisotryPage);
    const changePage = ({ selected }: { selected: number }) => {
        setPageNumber(selected);
        };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const HisotryList = await fetchMiniLotteryHistory();
                setHisotryList(HisotryList || []);
                
            } catch (error) {
                NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
            }
        };
        fetchData();
    }, [session]);


    return (
        <div className='w-full h-full mt-10'>
            {hisotryList.length > 0 ? (
                <div className="relative h-[calc(100%-4rem)] w-full text-gray-500">
                    <table className="min-w-full text-center text-sm font-light">
                        <thead className="font-medium text-white">
                            <tr className="border-b border-slate-900 uppercase text-xs">
                                <th scope="col" className=" px-6 py-2">Loteria</th>
                                <th scope="col" className=" px-6 py-2 hidden sm:table-cell">Fecha</th>
                                <th scope="col" className=" px-6 py-2">Ticket</th>
                                <th scope="col" className=" px-6 py-2">Link</th>
                                <th scope="col" className=" px-6 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {hisotryList?.slice(pageNumber * HisotryPage, (pageNumber + 1) * HisotryPage).map((obj, index) => (
                                <tr key={index} className="border-b border-slate-700 uppercase text-xs text-white">
                                    <td className="whitespace-nowrap px-6 py-2 font-Courier font-semibold">{obj.minilottery}</td>
                                    <td className="whitespace-nowrap px-6 py-2 hidden sm:table-cell">{obj.date_results}</td>
                                    <td className="whitespace-nowrap px-6 py-2">{obj.winner}</td>
                                    <td className="whitespace-nowrap px-6 py-2 flex justify-center">
                                        <a href={obj.stream ?? "#"} target='blank' className='hover:text-blue-500 transition-colors duration-300'><FaLink /></a>
                                    </td>
                                    <td className="text-center align-middle whitespace-nowrap py-2 px-4 lg:px-6">
                                        {obj.is_active ? <p className='text-green-300'><GiCheckMark  /></p> : <p className='text-red-500'><GiCrossMark /></p>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ReactPaginate
                        previousLabel={<MdNavigateBefore/>}
                        nextLabel={<MdNavigateNext/>}
                        breakLabel={'...'}
                        pageCount={pageCount}
                        marginPagesDisplayed={0}
                        pageRangeDisplayed={5}
                        onPageChange={changePage}
                        className={'absolute -bottom-1 w-full flex flex-row items-center justify-center gap-x-2'}
                        pageClassName={'bg-slate-700 text-slate-700 rounded-full !px-3 !py-0 transition-colors duration-300'}
                        activeClassName={'bg-slate-600 text-slate-600 rounded-full !px-3 !py-0 transition-colors duration-300'}
                        previousClassName={'absolute left-5 bg-slate-700 rounded-full p-1 transition-colors duration-300'}
                        nextClassName={'absolute right-5 bg-slate-700 rounded-full p-1 transition-colors duration-300'} 
                    />
                </div>
                ) : (
                <div className='w-full h-full flex flex-col justify-start items-center'>
                    <span className='text-center text-gray-300 my-4 text-[0.55rem] md:text-xs'>
                        <p>¡Aun No hay Historial disponible para esta Loteria!</p>
                        <p>La Loteria se realizara el proximo dia 15</p>
                    </span>
                </div>
            )}
        </div>
    );
};

export default ListHistoryMiniLotteryModal;
