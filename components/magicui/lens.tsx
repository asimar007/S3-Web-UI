"use client";

import { AnimatePresence, motion, useMotionTemplate } from "motion/react";
import React, { useCallback, useMemo, useState } from "react";

const ZOOM_FACTOR = 1.3;
const LENS_SIZE = 170;

interface LensProps {
  children: React.ReactNode;
}

export function Lens({ children }: LensProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsHovering(false);
  }, []);

  const maskImage = useMotionTemplate`radial-gradient(circle ${
    LENS_SIZE / 2
  }px at ${position.x}px ${position.y}px, black 100%, transparent 100%)`;

  const lensContent = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, scale: 0.58 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.1 }}
        className="absolute inset-0 overflow-hidden"
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
          transformOrigin: `${position.x}px ${position.y}px`,
          zIndex: 50,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${ZOOM_FACTOR})`,
            transformOrigin: `${position.x}px ${position.y}px`,
          }}
        >
          {children}
        </div>
      </motion.div>
    ),
    [position, maskImage, children],
  );

  return (
    <div
      className="relative z-20 overflow-hidden rounded-xl"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Zoom Area"
      tabIndex={0}
    >
      {children}
      <AnimatePresence mode="popLayout">
        {isHovering && lensContent}
      </AnimatePresence>
    </div>
  );
}
