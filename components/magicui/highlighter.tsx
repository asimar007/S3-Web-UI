"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import type React from "react";
import { cn } from "@/lib/utils";

// Define available annotation actions
type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket";

// Custom TypeScript interface for supported props
interface HighlighterProps {
  children: React.ReactNode;
  action?: AnnotationAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc", // Default pink color
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      const annotation = annotate(element, {
        type: action,
        color,
        strokeWidth,
        animationDuration,
        iterations,
        padding,
        multiline,
      });

      annotation.show();

      // Store the current element in closure for cleanup
      return () => {
        if (element) {
          annotate(element, { type: action }).remove();
        }
      };
    }
  }, [
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
  ]);

  // `highlight` paints a saturated marker behind the text. The inherited light
  // foreground lands at 2-3:1 on every accent this project uses, so fill
  // annotations pin a dark foreground that pairs with the marker, not the page.
  const isFilled = action === "highlight";

  return (
    <span
      ref={elementRef}
      className={cn(
        "relative inline-block bg-transparent",
        isFilled && "text-neutral-950",
      )}
    >
      {children}
    </span>
  );
}
