"use client";

import { AnimatePresence, motion, Variants } from "motion/react";
import { cn } from "@/lib/utils";
import React from "react";

interface FlipTextProps {
  children: React.ReactNode;
  className?: string;
}

const variants: Variants = {
  hidden: { rotateX: -90, opacity: 0 },
  visible: { rotateX: 0, opacity: 1 },
};

export function FlipText({ children, className }: FlipTextProps) {
  const characters = React.Children.toArray(children).join("").split("");

  return (
    <div className="flex justify-left space-x-2">
      <AnimatePresence mode="wait">
        {characters.map((char, i) => (
          <motion.span
            key={i}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={cn("origin-center drop-shadow-sm", className)}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
