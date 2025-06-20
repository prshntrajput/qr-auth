"use client"
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          QR Scanner Auth
        </h1>
        
        <p className="text-gray-600 mb-8">
          Scan QR codes from web applications to authenticate securely
        </p>
        
        <Link 
          href="/scanner"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Start Scanning
        </Link>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Install this app on your device for quick access</p>
        </div>
      </div>
    </div>
  );
}