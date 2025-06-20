'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QRDisplay from '../_components/QrDisplay';

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    // Store user data in localStorage or context
    localStorage.setItem('user', JSON.stringify(userData));
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full">
        <QRDisplay onAuthSuccess={handleAuthSuccess} />
      </div>
    </div>
  );
}