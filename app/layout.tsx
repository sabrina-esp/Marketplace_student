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
  manifest: '/manifest.json?v=brand-2',
  themeColor: '#611F69',
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
      { url: '/icons/icon-192x192.png?v=brand-2', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png?v=brand-2', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-180x180.png?v=brand-2', sizes: '180x180', type: 'image/png' },
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
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
        <link rel="manifest" href="/manifest.json?v=brand-2" />
        <meta name="theme-color" content="#611F69" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Marketplace" />
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png?v=brand-2" />
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
