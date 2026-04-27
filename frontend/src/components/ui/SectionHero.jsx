import { motion, useReducedMotion } from "framer-motion";
import { fadeUpVariants } from "./motion";

const MotionSection = motion.section;
const MotionSpan = motion.span;
const MotionH1 = motion.h1;
const MotionP = motion.p;
const MotionDiv = motion.div;

export default function SectionHero({
  eyebrow,
  title,
  description,
  actions = null,
  children = null,
  className = "",
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionSection
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUpVariants}
      className={`overflow-hidden rounded-3xl border border-[#d8e7c5] bg-[linear-gradient(135deg,#f7fbf1_0%,#eef7e2_45%,#f9fcf3_100%)] px-5 py-7 shadow-[0_24px_60px_rgba(73,110,33,0.10)] sm:px-8 sm:py-10 ${className}`.trim()}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <MotionSpan
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.03 }}
              className="inline-flex rounded-full border border-[#cfe1b7] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#4f7a2f]"
            >
              {eyebrow}
            </MotionSpan>
          ) : null}
          <MotionH1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.38, delay: 0.06 }}
            className="mt-4 text-3xl font-semibold tracking-tight text-[#203014] sm:text-4xl"
          >
            {title}
          </MotionH1>
          {description ? (
            <MotionP
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: 0.1 }}
              className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base"
            >
              {description}
            </MotionP>
          ) : null}
        </div>

        {actions ? (
          <MotionDiv
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.34, delay: 0.12 }}
            className="w-full lg:w-auto lg:max-w-sm"
          >
            {actions}
          </MotionDiv>
        ) : null}
      </div>

      {children ? (
        <MotionDiv
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.36, delay: 0.14 }}
          className="mt-6"
        >
          {children}
        </MotionDiv>
      ) : null}
    </MotionSection>
  );
}
