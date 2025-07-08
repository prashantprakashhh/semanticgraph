import { useState } from 'react';
import { apiRegister } from '../api';
import MessageBox from '../components/common/MessageBox';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

const RegisterPage = ({ onSwitchToLogin }: RegisterPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (password.length < 6) {
        setMessage({ text: 'Password must be at least 6 characters long.', type: 'error' });
        return;
    }
    try {
      const res = await apiRegister({ username, password });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setMessage({ text: 'Registration successful! Please login.', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && <MessageBox message={message.text} type={message.type} />}
          <div>
            <label className="block text-sm font-medium text-gray-300">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="font-medium text-blue-400 hover:underline">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;