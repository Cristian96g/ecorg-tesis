import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export default function AnimatedNumber({
  value = 0,
  duration = 900,
  formatter = (current) => current.toLocaleString("es-AR"),
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(
    Number.isFinite(Number(value)) ? Number(value) : 0
  );

  useEffect(() => {
    const nextValue = Number.isFinite(Number(value)) ? Number(value) : 0;

    if (shouldReduceMotion || !isInView) {
      setDisplayValue(nextValue);
      return undefined;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayValue(Math.round(nextValue * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    setDisplayValue(0);
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [duration, isInView, shouldReduceMotion, value]);

  return <span ref={ref}>{formatter(displayValue)}</span>;
}
