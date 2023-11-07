'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { fetchCardsGiveaway } from '@/app/api/cards/route';
import { w3cwebsocket as W3CWebSocket } from 'websocket';


const Cards = ({  }) => {

    const [cardsGiveaway, setcardsGiveaway] = useState([]);

    useEffect(() => {
      const websocketURL = 'ws://localhost:8000/ws/imagen-slider-updates/';  
      const client = new W3CWebSocket(websocketURL);
  
      client.onopen = () => {
        console.log('Conexión WebSocket abierta');
      };
  
      fetchImagenSliders()
        .then((data) => {
            setcardsGiveaway(data);
        })
        .catch((error) => {
          console.error('Error al obtener datos iniciales de imagenSliders:', error);
        });

      client.onmessage = (message) => {
        const data = JSON.parse(message.data);
        setcardsGiveaway(data);
      };
  
      client.onclose = () => {
        console.log('Conexión WebSocket cerrada');
      };
  
      client.onerror = (error) => {
        console.error('Error de conexión WebSocket:', error);
      };
  
      return () => {
        if (client.readyState === client.OPEN) {
          client.close();
        }
      };
    }, []);



    const cardData = [
        { progress: 100-10 },
        { progress: 100-25 },
        { progress: 100-50 },
        { progress: 100-100 },
    ];
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center py-4 mb-16">
            {cardsGiveaway.map((card, i) => (
                <div key={i} className="relative flex flex-col items-center rounded-sm h-40 md:h-80">
                    <Image width={1240} height={550} src={"https://flowbite.com/docs/images/carousel/carousel-3.svg"} className="absolute top-0 left-0 h-[calc(100%-16px)] w-full object-cover rounded-t-sm z-0" alt="" />
                    <div className="absolute bottom-0 h-8 w-full bg-gray-700 rounded-b-sm px-2 flex flex-row items-center gap-x-1">
                        <div className="relative w-full bg-white h-4">
                            <div className='absolute h-full w-full bg-gradient-to-r from-lime-400 to-red-600 transition-all duration-200'/>
                            <div className="absolute h-full w-full flex items-end justify-end">
                                <div className='h-full w-full flex  bg-slate-800 transition-all duration-200' style={{ width: `${card.progress}%` }} />
                            </div>
                        </div>
                        <button className="z-10 w-32 text-gray-100 py-1 px-2 rounded inline-flex gap-x-2 items-center justify-center">
                            <p className="uppercase font-semibold text-sm">Comprar</p>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Cards;

