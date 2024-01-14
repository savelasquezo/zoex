import './globals.css'
import Head from 'next/head';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({children,}: {children: React.ReactNode}) {
  return (
    <html lang="es">
      <Head>
        <title>ZoeX</title>
        <meta name="description" content="ZoeX Apuestas" />
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Head>
      <body className={inter.className}>
          {children}
      </body>
    </html>
  )
}
