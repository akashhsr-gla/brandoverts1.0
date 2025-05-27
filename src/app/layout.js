import { Inter } from 'next/font/google'
import './globals.css'
import ToasterComponent from '@/Components/Toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Brandovert - Professional Branding Agency',
  description: 'Transform your brand with Brandovert. We offer web development, app development, UGC video creation, and comprehensive branding solutions.',
  keywords: 'branding agency, web development, app development, UGC video, digital marketing',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <ToasterComponent />
        {children}
      </body>
    </html>
  )
}
