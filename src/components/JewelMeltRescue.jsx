import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const JewelRescue = () => {
  const [jewels, setJewels] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(true);
  const navigate = useNavigate();

  const jewelTypes = ['💎', '🔶', '🔷', '❄️'];

  useEffect(() => {
    if (!gameActive) return;

    // Spawn jewels periodically
    const spawnInterval = setInterval(() => {
      setJewels(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          type: jewelTypes[Math.floor(Math.random() * jewelTypes.length)],
          x: Math.random() * 90,
          y: Math.random() * 90,
          size: 40,
        }
      ]);
    }, 800);

    return () => clearInterval(spawnInterval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    // Melt jewels by shrinking them over time
    const meltInterval = setInterval(() => {
      setJewels(prev =>
        prev.map(jewel => ({
          ...jewel,
          size: jewel.size * 0.93,
        })).filter(jewel => jewel.size > 15) // Remove jewels that melted too much
      );
    }, 500);

    return () => clearInterval(meltInterval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    // Countdown timer
    const timer = timeLeft > 0 && setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    if (timeLeft === 0) {
      setGameActive(false);
    }

    return () => clearInterval(timer);
  }, [timeLeft, gameActive]);

  const handleClick = (id) => {
    if (!gameActive) return;
    setJewels(prev => prev.filter(jewel => jewel.id !== id));
    setScore(prev => prev + 10);
  };

  const resetGame = () => {
    setJewels([]);
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
  };

  return (
    <div className="container mt-5 text-center">
      <button
        onClick={() => navigate('/')}
        className="btn btn-outline-primary mb-3"
      >
        <FaHome /> Back to Store
      </button>

      <h2 className="mb-4">💎 Jewel Melt Rescue</h2>
      <div className="d-flex justify-content-center gap-5 mb-4">
        <p className="fs-4">Time: {timeLeft}s</p>
        <p className="fs-4">Score: {score}</p>
      </div>

      <div
        className="game-area mx-auto position-relative"
        style={{
          width: '100%',
          maxWidth: '500px',
          height: '400px',
          border: '2px solid #0d6efd',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        {jewels.map(jewel => (
          <div
            key={jewel.id}
            onClick={() => handleClick(jewel.id)}
            style={{
              position: 'absolute',
              left: `${jewel.x}%`,
              top: `${jewel.y}%`,
              fontSize: `${jewel.size}px`,
              cursor: 'pointer',
              transform: 'translate(-50%, -50%)',
              transition: 'font-size 0.2s ease-out, transform 0.2s ease-out',
            }}
            className="jewel-item"
          >
            {jewel.type}
          </div>
        ))}
      </div>

      {!gameActive && (
        <div className="mt-4">
          <div className={`alert ${score >= 150 ? 'alert-success' : 'alert-info'}`}>
            <h4>Game Over!</h4>
            <p>Your final score: {score}</p>
            {score >= 150 && (
              <p>You're a Jewel Hero! Thanks for saving the gems! 💎</p>
            )}
          </div>
          <button onClick={resetGame} className="btn btn-primary">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default JewelRescue;
