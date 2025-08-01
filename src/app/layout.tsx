import type { Metadata } from "next";
import { Inter} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL('https://posterboys.store'),
  title: {
    default: 'PosterBoys | Premium Posters for Every Wall',
    template: '%s | PosterBoys',
  },
  description: 'Buy high-quality posters for any mood or room.',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'PosterBoys',
    description: 'Premium wall posters, fast shipping, affordable prices.',
    url: 'https://posterboys.store',
    siteName: 'PosterBoys',
    images: [
      {
        url: '/icon.png',
        width: 1200,
        height: 630,
        alt: 'PosterBoys banner',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PosterBoys Posters',
    description: 'Buy premium wall posters at PosterBoys.shop',
    images: ['/icon.png'],
  },
  alternates:{
    canonical: 'https://posterboys.store',
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable}  antialiased `}
      >
         <div className='md:text-xs text-[0.6rem] p-0.5 w-full flex items-center text-white justify-center bg-gradient-to-r from-[#338ED1] to-[#F933A5] gap-1 font-medium'>⚡Express & <span className='font-extrabold'> FREE </span> Shipping on <span className='font-bold'> Prepaid Order</span> <Link href={"/"} className=' underline md:pl-1'> Shop Now </Link></div>
        <Navbar/>
        {children}
        <Footer/>
      </body>

    </html>
  );
}
