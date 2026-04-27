import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { hoverLift } from "./ui/motion";

const MotionDiv = motion.div;

export default function FeatureCard({ icon: Icon, title, description, link }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionDiv
      {...(shouldReduceMotion ? {} : hoverLift)}
      className="h-full min-w-0"
    >
      <Link
        to={link}
        className="group block h-full min-w-0 rounded-[28px] border border-[#dce8ce] bg-white p-6 sm:p-7 shadow-[0_16px_40px_rgba(59,89,34,0.08)] transition hover:border-[#c7dcb0] hover:shadow-[0_18px_44px_rgba(59,89,34,0.12)]"
      >
        {Icon && (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1f7e7] transition-colors duration-200 group-hover:bg-[#eaf4dd]">
            <Icon className="h-7 w-7 text-[#66a939] transition-transform duration-200 group-hover:scale-105 group-hover:-translate-y-0.5" />
          </div>
        )}

        <h2 className="mt-5 break-words text-xl font-semibold text-[#29401a]">{title}</h2>
        <p className="mt-3 line-clamp-3 min-w-0 break-words text-sm leading-6 text-slate-600">{description}</p>
        <span className="mt-5 inline-flex text-sm font-semibold text-[#5a9732]">
          Explorar sección
        </span>
      </Link>
    </MotionDiv>
  );
}
