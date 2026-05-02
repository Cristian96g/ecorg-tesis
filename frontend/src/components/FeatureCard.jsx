import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { cardGlowMotion, fadeUpVariants } from "./ui/motion";

const MotionDiv = motion.div;
const MotionLink = motion(Link);
const MotionIconWrap = motion.div;
const MotionArrow = motion(FiArrowRight);

export default function FeatureCard({ icon: Icon, title, description, link }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionDiv
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.18 }}
      variants={shouldReduceMotion ? undefined : fadeUpVariants}
      {...(shouldReduceMotion ? {} : cardGlowMotion)}
      className="h-full min-w-0"
    >
      <MotionLink
        to={link}
        className="group flex h-full min-w-0 flex-col rounded-[28px] border border-[#dce8ce] bg-white p-6 shadow-[0_16px_40px_rgba(59,89,34,0.08)] transition hover:border-[#c7dcb0] hover:shadow-[0_18px_44px_rgba(59,89,34,0.12)] sm:p-7"
      >
        {Icon ? (
          <MotionIconWrap
            whileHover={shouldReduceMotion ? undefined : { scale: 1.05, rotate: -2 }}
            transition={
              shouldReduceMotion
                ? undefined
                : { type: "spring", stiffness: 320, damping: 22 }
            }
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1f7e7] transition-colors duration-200 group-hover:bg-[#eaf4dd]"
          >
            <Icon className="h-7 w-7 text-[#66a939] transition-transform duration-200 group-hover:scale-105 group-hover:-translate-y-0.5" />
          </MotionIconWrap>
        ) : null}

        <h2 className="mt-5 min-h-[56px] break-words text-xl font-semibold leading-7 text-[#29401a]">
          {title}
        </h2>
        <p className="mt-3 line-clamp-3 min-w-0 break-words text-sm leading-6 text-slate-600">
          {description}
        </p>

        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[#5a9732]">
          Explorar sección
          <MotionArrow
            className="h-4 w-4"
            whileHover={shouldReduceMotion ? undefined : { x: 2 }}
            transition={
              shouldReduceMotion
                ? undefined
                : { type: "spring", stiffness: 360, damping: 24 }
            }
          />
        </span>
      </MotionLink>
    </MotionDiv>
  );
}
