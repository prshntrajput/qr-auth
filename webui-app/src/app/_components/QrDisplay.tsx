'use client';
import { useState, useEffect } from 'react';
import { initSocket } from '../../lib/socket';

interface QRDisplayProps {
  onAuthSuccess: (user: any) => void;
}

export default function QRDisplay({ onAuthSuccess }: QRDisplayProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const [status, setStatus] = useState<string>('Generating QR Code...');
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    const socket = initSocket();

    socket.emit('request-qr');

    socket.on('qr-generated', (data) => {
      setQrCode(data.qrCode);
      setSessionId(data.sessionId);
      setStatus('Scan QR code with your mobile app to login');
    });

    socket.on('qr-scan-detected', () => {
      setStatus('QR Code scanned! Complete authentication on your mobile device...');
    });

    socket.on('auth-success', (data) => {
      setStatus('Authentication successful! Redirecting...');
      onAuthSuccess(data.user);
    });

    socket.on('error', (error) => {
      setStatus(`Error: ${error.message}`);
    });

    return () => {
      socket.off('qr-generated');
      socket.off('qr-scan-detected');
      socket.off('auth-success');
      socket.off('error');
    };
  }, [onAuthSuccess]);

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">QR Code Login</h2>
      
      <div className="mb-6">
        {qrCode ? (
          <img 
            src={qrCode} 
            alt="QR Code" 
            className="w-64 h-64 border-2 border-gray-300 rounded-lg"
          />
        ) : (
          <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
      
      <p className="text-center text-gray-600 max-w-sm">
        {status}
      </p>
      
      {sessionId && (
        <p className="text-xs text-gray-400 mt-2">
          Session: {sessionId.substring(0, 8)}...
        </p>
      )}
    </div>
  );
}