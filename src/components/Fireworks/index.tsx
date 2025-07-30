import confetti from "canvas-confetti";
import React, { useEffect, useRef } from "react";

const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const myConfetti = confetti.create(canvasRef.current!, {
      resize: true,
      useWorker: true,
    });

    if (audioRef.current) {
      audioRef.current.play();
    }

    myConfetti({
      particleCount: 100,
      spread: 160,
      origin: { y: 0.6 },
    });

    return () => {
      myConfetti.reset();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 9999,
        }}
      />
      <audio ref={audioRef} src="/audio/Celebration.mp3" />
    </div>
  );
};

export default Fireworks;
