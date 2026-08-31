"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import type React from "react";
import { cn } from "@/lib/utils";

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket";

interface HighlighterProps {
  children: React.ReactNode;
  action?: AnnotationAction;
  color?: string;
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const annotation = annotate(element, {
      type: action,
      color,
      strokeWidth: 1.5,
      animationDuration: 600,
      iterations: 2,
      padding: 2,
      multiline: true,
    });
    annotation.show();

    return () => {
      annotate(element, { type: action }).remove();
    };
  }, [action, color]);

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
