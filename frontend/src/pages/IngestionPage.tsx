import { useState } from 'react';
import { apiIngestText } from '../api';
import MessageBox from '../components/common/MessageBox';
import LoadingSpinner from '../components/common/LoadingSpinner';

const IngestionPage = () => {
  const [text, setText] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleIngest = async () => {
    if (!text.trim()) {
      setMessage({ text: 'Please enter some text to ingest.', type: 'error' });
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await apiIngestText(text);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ingestion failed');
      setMessage({ text: data.message, type: 'success' });
      setText('');
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Data Ingestion</h1>
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-xl">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here (e.g., 'Steve Jobs works at Apple Inc.'). The current simple NLP recognizes capitalized words as entities and the phrase 'works at' as a relationship."
          className="w-full h-64 p-4 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-4 text-center">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <button onClick={handleIngest} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Ingest Text
            </button>
          )}
        </div>
        {message && (
          <div className="mt-4">
            <MessageBox message={message.text} type={message.type} />
          </div>
        )}
      </div>
    </div>
  );
};

export default IngestionPage;