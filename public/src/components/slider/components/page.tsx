import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Session } from 'next-auth';
import { NextResponse } from 'next/server';

import { Carousel } from 'flowbite-react';

import { imageLoader } from '@/utils/imageConfig';

type SliderProps = {
  session: Session | null | undefined;
};

interface ImagenSlider {file: any;}

export const fetchImagenSliders = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/app/core/fetch-sliders/`,
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

const Slider: React.FC<SliderProps> = ({ session  }) => {
  
    const [imagenSliders, setImagenSliders] = useState<ImagenSlider[]>([]);

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
            <div className={`overflow-hidden relative z-0 ${session ? 'h-[calc(100vh-112px)]' : 'h-56 md:h-[calc(100vh-56px)]'}`}>
              <Carousel slide={true} slideInterval={1000} indicators={false}
                rightControl={<svg className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6 dark:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>}
                leftControl={<svg className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6 dark:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>}>
                {imagenSliders.map((imagenSlider, i) => (
                  <Image key={i} width={1240} height={550} src={imagenSlider.file} loader={imageLoader} priority={true} className="block w-full h-full" alt=""/>
                ))}
              </Carousel>
            </div>
            ) : (
            <div className="overflow-hidden relative h-56 md:h-[calc(100vh-56px)] z-0">
                <div className="hidden duration-700 ease-in-out" data-carousel-item>
                    <Image width={1280} height={800} src={"https://flowbite.com/docs/images/carousel/carousel-1.svg"} className="block absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2" loader={imageLoader} alt=""/>
                </div>
                <div className="hidden duration-700 ease-in-out" data-carousel-item>
                    <Image width={1280} height={800} src={"https://flowbite.com/docs/images/carousel/carousel-2.svg"} className="block absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2" loader={imageLoader} alt=""/>
                </div>
                <div className="hidden duration-700 ease-in-out" data-carousel-item>
                    <Image width={1280} height={800} src={"https://flowbite.com/docs/images/carousel/carousel-3.svg"} className="block absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2" loader={imageLoader} alt=""/>
                </div>
            </div>
            )}
        </div>
    </div>
  );
};

export default Slider
