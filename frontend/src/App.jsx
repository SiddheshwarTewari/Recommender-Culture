import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [userId, setUserId] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/data/recommendations.json`);
        const data = await response.json();
        setRecommendations(data[userId] || []);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      }
      setLoading(false);
    };

    fetchRecommendations();
  }, [userId]);

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-gradient-to-b from-black to-transparent p-6">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-red-600">MovieMind AI</h1>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            Select User ID (1-626):
          </label>
          <input
            type="number"
            min="1"
            max="626"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          />
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {recommendations.map((movie) => (
              <div
                key={movie.id}
                className="relative group cursor-pointer transform transition hover:scale-105"
              >
                <div className="aspect-w-2 aspect-h-3 bg-gray-800 rounded-lg overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold group-hover:text-red-600 transition">
                      {movie.title}
                    </h3>
                    <p className="text-gray-400 mt-2">Score: {movie.score.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
