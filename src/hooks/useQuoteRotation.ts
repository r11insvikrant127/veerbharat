// src/hooks/useQuoteRotation.ts
import { useState, useEffect } from 'react';

export function useQuoteRotation<T>(items: T[], interval: number = 5000) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, interval]);

  return items[currentIndex];
}