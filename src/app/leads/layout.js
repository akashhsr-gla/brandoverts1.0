import { AuthProvider } from '@/contexts/AuthContext';
import { Inter } from 'next/font/google';
import ToasterComponent from '@/Components/Toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Brandoverts - Lead Management',
  description: 'Lead management portal for Brandoverts',
};

export default function LeadsLayout({ children }) {
  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      <ToasterComponent />
      <AuthProvider>
        {children}
      </AuthProvider>
    </div>
  );
} 