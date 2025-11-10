import './globals.css';
import Navbar from './components/Navbar/index';
import Footer from './components/Footer/Footer';
import dynamic from 'next/dynamic';

const PWAInstaller = dynamic(() => import('./components/PWAInstaller'), {
  ssr: false
});

const FloatingInstallButton = dynamic(() => import('./components/FloatingInstallButton'), {
  ssr: false
});

export const metadata = {
  title: 'Marketplace Student - Learning Platform',
  description: 'Your complete learning marketplace with courses, mentors, and community support',
  manifest: '/manifest.json',
  themeColor: '#8b5cf6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Marketplace',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Marketplace" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
        <PWAInstaller />
        <FloatingInstallButton />
      </body>
    </html>
  )
}
