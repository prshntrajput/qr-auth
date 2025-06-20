import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          QR Web Authentication
        </h1>
        
        <p className="text-gray-600 mb-8">
          Secure authentication using QR codes and mobile devices
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/login"
            className="block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Login with QR Code
          </Link>
          
          <p className="text-sm text-gray-500">
            Use your mobile device to scan the QR code and authenticate
          </p>
        </div>
      </div>
    </div>
  );
}