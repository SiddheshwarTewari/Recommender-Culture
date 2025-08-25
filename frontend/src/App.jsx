import { useState, useEffect } from 'react';

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [userId, setUserId] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/data/recommendations.json`);
        const data = await response.json();
        setRecommendations(data[userId] || []);
      } catch (error) {
        console.error("Error loading recommendations:", error);
      }
      setLoading(false);
    };

    loadRecommendations();
  }, [userId]);

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white">MovieMind AI</h1>
        </div>
      </nav>

      <main className="container mx-auto p-8">
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select User ID (1-1000):
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border border-amber-300 rounded px-4 py-2"
          />
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map((movie) => (
              <div key={movie.id} 
                   className="border border-amber-200 rounded-lg p-4 hover:shadow-lg transition bg-white">
                <h2 className="text-lg font-semibold text-amber-800">{movie.title}</h2>
                <p className="text-amber-600 mt-2">Score: {movie.score.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
