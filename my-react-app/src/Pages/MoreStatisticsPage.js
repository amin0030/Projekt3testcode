import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/MoreStatisticsPage.css';

function MoreStatisticsPage() {
    const [drawnNumbers, setDrawnNumbers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchGameData() {
            try {
                const response = await fetch('http://localhost:3000/api/all-game-data');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const numbers = data.games.map(game => game.tal);
                setDrawnNumbers(numbers);
            } catch (error) {
                console.error('Error fetching game data:', error);
            }
        }

        fetchGameData();
    }, []);

    return (
        <div className="statistics-container">
            <h1>More Game Statistics</h1>
            <table className="statistics-table">
                <thead>
                    <tr>
                        <th>Drawn Number</th>
                    </tr>
                </thead>
                <tbody>
                    {drawnNumbers.map((number, index) => (
                        <tr key={index}>
                            <td>{number}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MoreStatisticsPage;
