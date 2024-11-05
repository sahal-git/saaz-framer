import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Navbar } from '@/components/layout/navbar';
import { HelpButton } from '@/components/help-button';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SAAZ FRAMER - Professional Image Framing Tool',
  description: 'Create beautifully framed images with custom overlays and watermarks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main>{children}</main>
          <HelpButton />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}