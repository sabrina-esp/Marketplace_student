import './globals.css';
import Navbar from './components/Navbar/index';
import Footer from './components/Footer/Footer';
import PWAInitializer from './components/PWAInitializer';
import OfflineBanner from './components/OfflineBanner';


export const metadata = {
  title: 'Student Marketplace',
  description: 'Discover and share student-built resources',
  manifest: '/manifest.json',
  themeColor: '#6b4eff',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.svg',
    other: [
      {
        rel: 'mask-icon',
        url: '/logo.svg',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <PWAInitializer />
        <OfflineBanner />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
