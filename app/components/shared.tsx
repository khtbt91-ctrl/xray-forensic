"use client";

import React, { useState, useEffect } from "react";

export const MONO = "JetBrains Mono, monospace";
export const SERIF_ITALIC = "'IBM Plex Serif', serif";

export function useCountUp(target: number, duration = 1500, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(e * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return val;
}

export function FadeInUp({
  children,
  delay = 0,
  className = "",
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`fade-in-up ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}s`, ...style } : style}
    >
      {children}
    </div>
  );
}
