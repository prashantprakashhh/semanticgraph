import { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { apiLogin } from '../api';
import MessageBox from '../components/common/MessageBox';

const LoginPage = ({ onSwitchToRegister }: { onSwitchToRegister: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const setToken = useAuthStore(state => state.setToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await apiLogin({ username, password });
      if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
      const { token } = await res.json();
      setToken(token);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <MessageBox message={error} type="error" />}
          <div>
            <label className="block text-sm font-medium text-gray-300">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="font-medium text-blue-400 hover:underline">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};
// Create a similar RegisterPage.tsx component or integrate it here.
export default LoginPage;