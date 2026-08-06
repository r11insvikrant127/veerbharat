// src/hooks/useParticles.ts
import { useState, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

export function useParticles(count: number = 20) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const newParticles = [...Array(count)].map((_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 2,
      }));
      setParticles(newParticles);
    }
  }, [count]);

  return { particles, isMounted };
}