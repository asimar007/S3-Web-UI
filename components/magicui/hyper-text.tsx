"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const CHARACTER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const DURATION_MS = 800;

interface HyperTextProps {
  children: string;
  className?: string;
}

export function HyperText({ children, className }: HyperTextProps) {
  const [displayText, setDisplayText] = useState<string[]>(() =>
    children.split(""),
  );
  const [isAnimating, setIsAnimating] = useState(true);
  const iterationCount = useRef(0);

  useEffect(() => {
    if (!isAnimating) return;

    const maxIterations = children.length;
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / DURATION_MS, 1);
      iterationCount.current = progress * maxIterations;

      setDisplayText((currentText) =>
        currentText.map((letter, index) =>
          letter === " "
            ? letter
            : index <= iterationCount.current
              ? children[index]
              : CHARACTER_SET[Math.floor(Math.random() * CHARACTER_SET.length)],
        ),
      );

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [children, isAnimating]);

  const scrambleOnHover = () => {
    if (!isAnimating) {
      iterationCount.current = 0;
      setIsAnimating(true);
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden py-2 text-lg font-bold text-foreground tracking-tight leading-none",
        className,
      )}
      onMouseEnter={scrambleOnHover}
    >
      {displayText.map((letter, index) => (
        <motion.span
          key={index}
          className={cn("font-mono", letter === " " ? "w-3" : "")}
        >
          {letter.toUpperCase()}
        </motion.span>
      ))}
    </div>
  );
}
