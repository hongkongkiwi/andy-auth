import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth/components/auth-provider';

export const runtime = 'nodejs';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
