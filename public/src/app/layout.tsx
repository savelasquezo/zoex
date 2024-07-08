import '@/styles/styles.css';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ZoeX',
  description: 'ZoeX',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es">
      <Head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5GPWCDG30E"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5GPWCDG30E');
            `,
          }}
        />
      </Head>
      <body className={inter.className}>
          {children}
      </body>
    </html>
  )
}
