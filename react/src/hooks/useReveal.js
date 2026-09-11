import { useEffect, useRef, useState } from "react";

/**
 * Attaches an IntersectionObserver to the returned ref and flips
 * `visible` to true the first time the element enters the viewport.
 * Pass `delay` (ms) to stagger multiple elements revealing together.
 */
export function useReveal(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const style = delay ? { "--reveal-delay": delay } : undefined;
  return { ref, visible, style };
}
