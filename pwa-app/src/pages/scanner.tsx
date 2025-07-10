"use client"
import "../app/globals.css";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QRScanner from '../components/QrScanner';
import { initSocket } from '../socket/socket';

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const router = useRouter();

  const handleScan = (data: string) => {
    setScanResult(data);
    setStatus('QR Code scanned! Validating...');

    const socket = initSocket();
    socket.emit('qr-scanned', { qrData: data });

    socket.on('qr-valid', (response) => {
      setStatus('QR Code valid! Redirecting to authentication...');
      setTimeout(() => {
        router.push(`/auth?sessionId=${response.sessionId}`);
      }, 1000);
    });

    socket.on('qr-invalid', (error) => {
      setStatus(`Invalid QR Code: ${error.message}`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8">QR Code Scanner</h1>
      
      <QRScanner onScan={handleScan} />
      
      {status && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">{status}</p>
        </div>
      )}
      
      {scanResult && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
          <p>Scanned: {scanResult.substring(0, 50)}...</p>
        </div>
      )}
    </div>
  );
}