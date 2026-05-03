"use client";

import { useState, useEffect } from "react";

const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;

export function useAppScale() {
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);

  useEffect(() => {
    const updateScale = () => {
      const scaleX = window.innerWidth / BASE_WIDTH;
      const scaleY = window.innerHeight / BASE_HEIGHT;
      const newScale = Math.max(scaleX, scaleY);
      setScale(newScale);

      // Centraliza horizontalmente só se sobrar espaço
      const scaledWidth = BASE_WIDTH * newScale;
      const extra = window.innerWidth - scaledWidth;
      setOffsetX(extra > 0 ? extra / 2 : 0);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return { scale, offsetX, BASE_WIDTH, BASE_HEIGHT };
}
