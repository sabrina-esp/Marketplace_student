'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  useEffect(() => {
    // Styles globaux pour le dashboard
    if (typeof document !== 'undefined') {
      const styleId = 'dashboard-animations';
      
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @keyframes dashFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes dashScaleIn {
            from { 
              opacity: 0;
              transform: scale(0.9);
            }
            to { 
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-dash-fade-in {
            animation: dashFadeIn 0.2s ease-out;
          }
          
          .animate-dash-scale-in {
            animation: dashScaleIn 0.3s ease-out;
          }
          
          .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out backwards;
          }
          
          .card-hover {
            transition: all 0.3s ease;
          }
          
          .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
        `;
        document.head.appendChild(style);
      }
    }

    // Protection de route (optionnel)
    // const isAuthenticated = localStorage.getItem('user');
    // if (!isAuthenticated) {
    //   router.push('/');
    // }
  }, [router]);

  return <>{children}</>;
}