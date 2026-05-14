import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { cardGlowMotion, fadeUpVariants, iconNudgeMotion } from "./ui/motion";

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
        className="group flex h-full min-w-0 flex-col rounded-[24px] border border-[#dce8ce] bg-white p-4 shadow-[0_14px_34px_rgba(59,89,34,0.08)] transition-[border-color,box-shadow,background-color] duration-300 hover:border-[#c7dcb0] hover:shadow-[0_18px_44px_rgba(59,89,34,0.12)] sm:rounded-[28px] sm:p-7 sm:shadow-[0_16px_40px_rgba(59,89,34,0.08)]"
      >
        {Icon ? (
          <MotionIconWrap
            whileHover={shouldReduceMotion ? undefined : { scale: 1.05, rotate: -2 }}
            transition={
              shouldReduceMotion
                ? undefined
                : { type: "spring", stiffness: 320, damping: 22 }
            }
            className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#f1f7e7] transition-[background-color,transform] duration-300 group-hover:bg-[#eaf4dd] sm:h-14 sm:w-14 sm:rounded-2xl"
          >
            <Icon className="h-6 w-6 text-[#66a939] transition-transform duration-200 group-hover:scale-105 group-hover:-translate-y-0.5 sm:h-7 sm:w-7" />
          </MotionIconWrap>
        ) : null}

        <h2 className="mt-4 break-words text-lg font-semibold leading-6 text-[#29401a] sm:mt-5 sm:min-h-[56px] sm:text-xl sm:leading-7">
          {title}
        </h2>
        <p className="mt-2 line-clamp-2 min-w-0 break-words text-sm leading-5 text-slate-600 sm:mt-3 sm:line-clamp-3 sm:leading-6">
          {description}
        </p>

        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-[#5a9732] sm:pt-5">
          Explorar sección
          <MotionArrow
            className="h-4 w-4"
            {...(shouldReduceMotion ? {} : iconNudgeMotion)}
          />
        </span>
      </MotionLink>
    </MotionDiv>
  );
}
