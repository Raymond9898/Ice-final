import React, { useEffect, useRef, useState } from "react";

const JewelCatch = () => {
  const gameAreaRef = useRef(null);
  const basketRef = useRef(null);

  const [jewels, setJewels] = useState([]);
  const [score, setScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(5);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [muted, setMuted] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("highScore")) || 0;
  });

  useEffect(() => {
    if (score > 0 && score % 10 === 0) {
      setGameSpeed((prev) => Math.min(prev + 1, 15));
    }
  }, [score]);

  const moveBasket = (direction) => {
    const basket = basketRef.current;
    if (!basket || gameOver) return;

    const moveAmount = 20;
    const left = parseInt(getComputedStyle(basket).left, 10);

    if (direction === "left") {
      basket.style.left = Math.max(left - moveAmount, 0) + "px";
    } else {
      basket.style.left = Math.min(left + moveAmount, 400) + "px";
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["ArrowLeft", "a"].includes(e.key)) {
        moveBasket("left");
      } else if (["ArrowRight", "d"].includes(e.key)) {
        moveBasket("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const dropInterval = setInterval(() => {
      const newJewel = {
        id: Date.now(),
        left: Math.random() * 400,
        top: 0,
        speed: 5 + Math.random() * 3,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      };
      setJewels((prev) => [...prev, newJewel]);
    }, 800);

    return () => clearInterval(dropInterval);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setJewels((prevJewels) =>
        prevJewels
          .map((jewel) => {
            const newTop = jewel.top + jewel.speed;
            const basket = basketRef.current;
            if (!basket) return jewel;

            const basketLeft = parseInt(basket.style.left || 0, 10);
            const basketTop = 450;

            const caught =
              newTop >= basketTop &&
              jewel.left > basketLeft - 20 &&
              jewel.left < basketLeft + 100;

            if (caught) {
              setScore((prev) => prev + 1);
              return null;
            }

            if (newTop > 500) return null;

            return { ...jewel, top: newTop };
          })
          .filter(Boolean)
      );
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameOver, muted]);

  useEffect(() => {
    if (gameOver) return;

    if (timeLeft <= 0) {
      setGameOver(true);

      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("highScore", score);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver, muted, score, highScore]);

  const resetGame = () => {
    setJewels([]);
    setScore(0);
    setTimeLeft(30);
    setGameSpeed(5);
    setGameOver(false);
  };

  return (
    <div className="p-4 text-center">
      <h2 className="mb-2">💎 Jewel Catch</h2>

      <p>
        Score: {score} | Time Left: {timeLeft}s | 🏆 High Score: {highScore}
      </p>

      <button
        onClick={() => setMuted((prev) => !prev)}
        className="btn btn-sm btn-secondary mb-2"
      >
        {muted ? "🔇 Unmute" : "🔊 Mute"}
      </button>

      <div
        ref={gameAreaRef}
        className="position-relative mx-auto border border-dark"
        style={{
          width: "500px",
          height: "500px",
          backgroundColor: "#f0f8ff",
          overflow: "hidden",
        }}
      >
        <div
          ref={basketRef}
          className="position-absolute bg-primary"
          style={{
            bottom: "20px",
            left: "200px",
            width: "100px",
            height: "20px",
            borderRadius: "10px",
            transition: "left 0.1s",
          }}
        ></div>

        {jewels.map((jewel) => (
          <div
            key={jewel.id}
            className="position-absolute"
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              left: `${jewel.left}px`,
              top: `${jewel.top}px`,
              backgroundColor: jewel.color,
              transform: `rotate(${jewel.top * 2}deg)`,
              transition: "transform 0.1s",
            }}
          />
        ))}
      </div>

      <p className="mt-2">Use arrow keys or A/D to move the basket</p>

      {/* Mobile Touch Controls */}
      <div className="mt-3 d-flex justify-content-center gap-3">
        <button className="btn btn-outline-dark" onClick={() => moveBasket("left")}>
          ⬅️
        </button>
        <button className="btn btn-outline-dark" onClick={() => moveBasket("right")}>
          ➡️
        </button>
      </div>

      {gameOver && (
        <div className="mt-4">
          <h4 className="text-success">⏱️ Time's up! Final Score: {score}</h4>
          <button className="btn btn-primary mt-2" onClick={resetGame}>
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
};

export default JewelCatch;
