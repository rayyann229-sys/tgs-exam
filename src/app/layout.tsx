import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/lib/toast-context';

export const metadata: Metadata = {
  title: 'Iffi Cafe Pasrur — Fast Food, Gourmet Burgers & Coffee Hub',
  description: 'Pasrur Tehsil premier cafe and fast food restaurant. Order online for Zinger burgers, beef smash burgers, crown crust pizza, loaded fries, and late night Karak Chai.',
  keywords: ['Iffi Cafe Pasrur', 'Iffi Cafe', 'Pasrur Fast Food', 'Pasrur Cafe', 'Sialkot Food', 'Pasrur Burger', 'Pasrur Pizza'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen flex flex-col">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
