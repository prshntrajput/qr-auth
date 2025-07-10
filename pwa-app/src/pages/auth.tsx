import "../app/globals.css";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { initSocket } from '../socket/socket';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [status, setStatus] = useState('');
  const router = useRouter();
  const { sessionId } = router.query;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Authenticating...');

    const socket = initSocket();
    socket.emit('authenticate', {
      sessionId,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      action: isLogin ? 'login' : 'register'
    });

    socket.on('auth-success', () => {
      setStatus('Authentication successful! You can close this app.');
    });

    socket.on('auth-failed', (error) => {
      setStatus(`Authentication failed: ${error.message}`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>

        {status && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-blue-800 text-sm">{status}</p>
          </div>
        )}
      </div>
    </div>
  );
}