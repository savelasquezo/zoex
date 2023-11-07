'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { fetchImagenSliders } from '@/app/api/images/route';
const Carousel = ({ }) => {
  
    const [imagenSliders, setImagenSliders] = useState([]);

    useEffect(() => {
      fetchImagenSliders()
        .then((data) => {
          setImagenSliders(data);
        })
        .catch((error) => {
          console.error('Error al obtener datos iniciales de imagenSliders:', error);
        });
    }, []);
    return (
  
    <div className="w-screen mx-0">
        <div id="default-carousel" className="relative" data-carousel="slide">
                {imagenSliders.length > 0 ? (
                <div className="overflow-hidden relative h-56 md:h-[calc(100vh-114px)] z-0">
                    {imagenSliders.map(imagenSlider => (
                    <div className="hidden duration-700 ease-in-out" data-carousel-item>
                        <Image width={1280} height={800} src={imagenSlider.file} className="block absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover" alt=""/>
                    </div>
                    ))}
                </div>
                ) : (
                <div className="overflow-hidden relative h-56 md:h-[calc(100vh-114px)] z-0">
                    <div className="hidden duration-700 ease-in-out" data-carousel-item>
                        <Image width={1280} height={800} src={"https://flowbite.com/docs/images/carousel/carousel-1.svg"} className="block absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2" alt=""/>
                    </div>
                    <div className="hidden duration-700 ease-in-out" data-carousel-item>
                        <Image width={1280} height={800} src={"https://flowbite.com/docs/images/carousel/carousel-2.svg"} className="block absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2" alt=""/>
                    </div>
                    <div className="hidden duration-700 ease-in-out" data-carousel-item>
                        <Image width={1280} height={800} src={"https://flowbite.com/docs/images/carousel/carousel-3.svg"} className="block absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2" alt=""/>
                    </div>
                </div>
                )}
                <button type="button" className="flex absolute -top-10 left-0 z-30 justify-center items-center px-6 h-full cursor-pointer group focus:outline-none" data-carousel-prev>
                    <span className="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-transparent dark:group-focus:ring-transparent group-focus:outline-none">
                        <svg className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6 dark:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </span>
                </button>
                <button type="button" className="flex absolute -top-10 right-0 z-30 justify-center items-center px-6 h-full cursor-pointer group focus:outline-none" data-carousel-next>
                    <span className="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-transparent dark:group-focus:ring-transparent group-focus:outline-none">
                        <svg className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6 dark:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </span>
                </button>
        </div>
        <script src="https://unpkg.com/flowbite@1.4.0/dist/flowbite.js"></script>
    </div>
  );
};

export default Carousel
