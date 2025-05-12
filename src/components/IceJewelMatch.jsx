import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const JewelMatch = () => {
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const gems = ['💎', '❄️', '🔷', '🔶', '✨'];

  // Initialize board
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const initialBoard = Array(8).fill().map(() => 
      Array(8).fill().map(() => gems[Math.floor(Math.random() * gems.length)])
    );
    setBoard(initialBoard);
    setScore(0);
    setGameOver(false);
  };

  // Draw board
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    board.forEach((row, y) => {
      row.forEach((gem, x) => {
        ctx.font = '30px Arial';
        ctx.fillText(gem, x * 40 + 20, y * 40 + 35);
        if (selected && selected.x === x && selected.y === y) {
          ctx.strokeStyle = 'blue';
          ctx.strokeRect(x * 40 + 5, y * 40 + 5, 40, 40);
        }
      });
    });
  }, [board, selected]);

  const handleClick = (x, y) => {
    if (gameOver) return;

    if (!selected) {
      setSelected({ x, y });
    } else {
      if ((Math.abs(selected.x - x) === 1 && selected.y === y) || 
          (Math.abs(selected.y - y) === 1 && selected.x === x)) {
        const newBoard = [...board];
        [newBoard[y][x], newBoard[selected.y][selected.x]] = 
          [newBoard[selected.y][selected.x], newBoard[y][x]];
        setBoard(newBoard);
        checkMatches(newBoard);
      }
      setSelected(null);
    }
  };

  const checkMatches = (board) => {
    let matched = false;
    const newBoard = [...board];

    // Check horizontal matches
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 6; x++) {
        if (newBoard[y][x] && newBoard[y][x] === newBoard[y][x + 1] && 
            newBoard[y][x] === newBoard[y][x + 2]) {
          newBoard[y][x] = newBoard[y][x + 1] = newBoard[y][x + 2] = '';
          matched = true;
          setScore(prev => prev + 30);
        }
      }
    }

    // Check vertical matches
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 6; y++) {
        if (newBoard[y][x] && newBoard[y][x] === newBoard[y + 1][x] && 
            newBoard[y][x] === newBoard[y + 2][x]) {
          newBoard[y][x] = newBoard[y + 1][x] = newBoard[y + 2][x] = '';
          matched = true;
          setScore(prev => prev + 30);
        }
      }
    }

    if (matched) {
      setBoard(newBoard);
      setTimeout(() => refillBoard(newBoard), 500);
    }

    // Check for game over
    if (score >= 100) {
      setGameOver(true);
    }
  };

  const refillBoard = (board) => {
    const newBoard = [...board];
    for (let x = 0; x < 8; x++) {
      for (let y = 7; y >= 0; y--) {
        if (newBoard[y][x] === '') {
          for (let yy = y; yy > 0; yy--) {
            newBoard[yy][x] = newBoard[yy - 1][x];
          }
          newBoard[0][x] = gems[Math.floor(Math.random() * gems.length)];
        }
      }
    }
    setBoard(newBoard);
  };

  return (
    <div className="container mt-5 text-center">
      <button 
        onClick={() => navigate('/')} 
        className="btn btn-outline-primary mb-3"
      >
        <FaHome /> Back to Store
      </button>

      <h2 className="mb-4">❄️ Ice Jewel Match</h2>
      <p className="fs-4">Score: {score}</p>
      
      <div className="d-flex justify-content-center">
        <canvas 
          ref={canvasRef} 
          width="320" 
          height="320"
          style={{ border: '2px solid #0d6efd', borderRadius: '8px' }}
          onClick={(e) => {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / 40);
            const y = Math.floor((e.clientY - rect.top) / 40);
            if (x >= 0 && x < 8 && y >= 0 && y < 8) {
              handleClick(x, y);
            }
          }}
        />
      </div>

      {gameOver && (
        <div className="alert alert-success mt-3">
          You won!
        </div>
      )}

      <button onClick={resetGame} className="btn btn-primary mt-3">
        Reset Game
      </button>
    </div>
  );
};

export default JewelMatch;
