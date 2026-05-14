import { motion, useReducedMotion } from "framer-motion";
import { fadeUpVariants, subtleStagger } from "./motion";

const MotionDiv = motion.div;

export function Reveal({
  children,
  className = "",
  delay = 0,
  amount = 0.18,
  variants = fadeUpVariants,
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionDiv
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount }}
      variants={shouldReduceMotion ? undefined : variants}
      transition={shouldReduceMotion ? undefined : { delay }}
      className={className}
    >
      {children}
    </MotionDiv>
  );
}

export function StaggerGroup({
  children,
  className = "",
  amount = 0.12,
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionDiv
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount }}
      variants={shouldReduceMotion ? undefined : subtleStagger}
      className={className}
    >
      {children}
    </MotionDiv>
  );
}

export function StaggerItem({ children, className = "" }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionDiv
      variants={shouldReduceMotion ? undefined : fadeUpVariants}
      className={className}
    >
      {children}
    </MotionDiv>
  );
}
