'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';


import io from 'socket.io-client';

const Banner = () => {

    const [imagenLottery, setImagenLottery] = useState([]);



    return (
        <div className="w-full h-full z-10">
            <p className='bg-white w-full h-12 text-black'>{imagenLottery.id}</p>
            <div className="relative h-40 md:h-96 items-center">
                <Image width={1250} height={385} className="absolute top-0 left-0 h-full w-full object-cover rounded-md z-0" src={imagenLottery.banner} alt=""/>
                <button className="z-10 w-32 absolute bottom-3 right-3 bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded inline-flex gap-x-2 items-center justify-center">
                    <p className="uppercase font-semibold text-sm">Comprar</p>
                </button>
            </div>
        </div>
    );
};

export default Banner