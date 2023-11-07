import Head from 'next/head';

import Navbar from '../components/navbar/index';
import Footer from '../components/footer';
import Carousel from '../components/carousel';
import Banner from '../components/banner';
import Cards from '../components/cards';

export default function Home() {
  return (
    <>
      <Head>
        <title>ZoeX</title>
        <meta name='description' content='ZoeX-Sorteos/Rifas' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navbar />
      <main className='w-full h-full overflow-x-hidden bg-slate-800'>
        <Carousel />
        <div className="w-full h-full flex flex-col gap-y-4 p-8 mb-10">
          <Banner />
          <Cards />
        </div>
      </main>
      <Footer />
    </>
  );
}
