import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/StatisticsPage.css';

function StatisticsPage() {
  const [gameData, setGameData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Using the navigate function from react-router-dom

  useEffect(() => {
    async function fetchGameData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3000/api/game-data-with-winners'); // Changed endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Fetched Data:", data); // Debugging to see what data is being received

        setGameData(data.games);
      } catch (error) {
        console.error('Error fetching game data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGameData();
  }, []);

  const goToActiveBets = () => {
    navigate('/active-bets');
  };

  const goToMoreStatistics = () => {
    navigate('/MoreStatisticsPage');  // This will navigate to MoreStatisticsPage
  };

  const clearGameData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/clear-game-data', {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log(result.message); // Debugging to see the response message
      setGameData([]); // Clear the game data in the state
    } catch (error) {
      console.error('Error clearing game data:', error);
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="statistics-container">
      <h1>Game Statistics</h1>
      <button onClick={goToActiveBets} className="view-active-bets-button">View Active Bets</button>
      <button onClick={goToMoreStatistics} className="view-more-stats-button">View More Statistics</button>
      <button onClick={clearGameData} className="clear-game-data-button">Clear Game Data</button>
      {gameData.length > 0 ? (
        <table className="statistics-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Drawn Number</th>
              <th>Color</th>
              <th>Winner</th>
            </tr>
          </thead>
          <tbody>
            {gameData.map((game, index) => (
              <tr key={index}>
                <td>{game.spiller}</td>
                <td>{game.tal}</td>
                <td>{game.farve}</td>
                <td>{game.vinder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No game data available.</p>
      )}
    </div>
  );
}

export default StatisticsPage;
