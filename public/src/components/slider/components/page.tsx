import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Session } from 'next-auth';
import { NextResponse } from 'next/server';



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

        </div>
    </div>
  );
};

export default Slider
