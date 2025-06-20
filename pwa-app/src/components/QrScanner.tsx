'use client';
import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

interface QRScannerProps {
  onScan: (data: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError('');
      setIsScanning(true);

      if (codeReader.current && videoRef.current) {
        const result = await codeReader.current.decodeOnceFromVideoDevice(
          undefined,
          videoRef.current
        );
        
        if (result) {
          onScan(result.getText());
          stopScanning();
        }
      }
    } catch (err) {
      setError('Failed to start camera or scan QR code');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    setIsScanning(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <video
          ref={videoRef}
          className="w-80 h-80 bg-black rounded-lg"
          style={{ display: isScanning ? 'block' : 'none' }}
        />
        {!isScanning && (
          <div className="w-80 h-80 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Camera preview will appear here</p>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        {!isScanning ? (
          <button
            onClick={startScanning}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Start Scanning
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Stop Scanning
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
}