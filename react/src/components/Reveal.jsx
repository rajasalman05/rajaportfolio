import React from 'react';
import { useReveal } from "../hooks/useReveal.js";

/**
 * Wraps children in a scroll-triggered fade/slide reveal.
 * type: "up" | "fade" | "left" | "right"
 */
export default function Reveal({ as: Tag = "div", type = "up", delay = 0, className = "", children }) {
  const { ref, visible, style } = useReveal(delay);
  return (
    <Tag
      ref={ref}
      data-reveal={type}
      className={`${visible ? "is-visible" : ""} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
