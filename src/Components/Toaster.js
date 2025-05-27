import { Toaster } from 'react-hot-toast';

export default function ToasterComponent() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 5000,
        style: {
          background: '#fff',
          color: '#333',
          border: '1px solid #c60000',
        },
        success: {
          style: {
            background: '#f0fff4',
            border: '1px solid #38a169',
          },
          iconTheme: {
            primary: '#38a169',
            secondary: '#fff',
          },
        },
        error: {
          style: {
            background: '#fff5f5',
            border: '1px solid #c60000',
          },
          iconTheme: {
            primary: '#c60000',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}