import { useState } from 'react';
import { useAuthStore } from './store/auth';
import LoginPage from './pages/LoginPage';
import IngestionPage from './pages/IngestionPage';
import GraphExplorerPage from './pages/GraphExplorerPage';
import RegisterPage from './pages/RegisterPage';
import { LogOut, Upload, Share2 } from 'lucide-react';

function App() {
  const { isLoggedIn, setToken } = useAuthStore();
  const [currentPage, setCurrentPage] = useState('ingest'); // 'ingest' or 'explore'
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  const handleLogout = () => {
    setToken(null);
  };

  // If the user is not logged in, show the authentication pages
  if (!isLoggedIn()) {
    return authView === 'login' ? (
      <LoginPage onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  // If the user is logged in, show the main application
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <nav className="w-64 bg-gray-800 p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-8">SKG Explorer</h1>
          <ul>
            <li 
              className={`mb-4 p-2 rounded-md cursor-pointer flex items-center ${currentPage === 'ingest' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setCurrentPage('ingest')}>
              <Upload className="mr-3 h-5 w-5" /> Ingestion
            </li>
            <li 
              className={`p-2 rounded-md cursor-pointer flex items-center ${currentPage === 'explore' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setCurrentPage('explore')}>
              <Share2 className="mr-3 h-5 w-5" /> Explore Graph
            </li>
          </ul>
        </div>
        <button onClick={handleLogout} className="w-full p-2 rounded-md bg-red-600 hover:bg-red-700 flex items-center justify-center">
          <LogOut className="mr-2 h-5 w-5" /> Logout
        </button>
      </nav>
      <main className="flex-1">
        {currentPage === 'ingest' && <IngestionPage />}
        {currentPage === 'explore' && <GraphExplorerPage />}
      </main>
    </div>
  );
}

export default App;