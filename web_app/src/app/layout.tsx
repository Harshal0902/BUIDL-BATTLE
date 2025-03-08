import '@/styles/globals.css'
import localFont from 'next/font/local'
import { type Metadata } from 'next'
import { STXWalletProvider } from '@/context/StxContext'
import { Toaster } from '@/components/ui/sonner'

const myFont = localFont({
  src: 'font/Juvanze-ovw9A.otf',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'APP NAME',
  description: 'Enter the world of escape rooms and discover a new way to socialize',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${myFont.className} antialiased`}>
        <STXWalletProvider>
          <main>
            {children}
          </main>
          <Toaster richColors closeButton />
        </STXWalletProvider>
      </body>
    </html>
  );
}
