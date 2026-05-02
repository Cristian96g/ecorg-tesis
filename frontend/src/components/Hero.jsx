import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiAlertCircle, FiBookOpen, FiMapPin } from "react-icons/fi";
import nature from "../assets/nature.jpg";
import {
  buttonMotion,
  cardGlowMotion,
  heroContainerVariants,
  heroItemVariants,
} from "./ui/motion";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;
const MotionArticle = motion.article;
const MotionLink = motion(Link);
const MotionImg = motion.img;

const heroHighlights = [
  {
    icon: FiMapPin,
    label: "Puntos verdes",
    text: "Ubicá lugares de reciclaje según el material que necesitás llevar.",
  },
  {
    icon: FiAlertCircle,
    label: "Reportes comunitarios",
    text: "Informá problemas ambientales con ubicación e imagen.",
  },
  {
    icon: FiBookOpen,
    label: "Educación ambiental",
    text: "Accedé a contenidos breves y útiles para mejorar hábitos diarios.",
  },
];

export default function Hero({
  title = "EcoRG: reciclaje y participación ciudadana para una Río Gallegos más limpia",
  subtitle = "EcoRG te ayuda a encontrar puntos verdes, reportar problemas ambientales y aprender sobre reciclaje con información útil para tu barrio.",
  primaryCta = { text: "Ver puntos verdes", to: "/mapa" },
  secondaryCta = { text: "Reportar problema", to: "/reportes" },
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#17351a] text-white">
      <div className="absolute inset-0">
        <MotionImg
          src={nature}
          alt="Paisaje natural de fondo"
          initial={shouldReduceMotion ? false : { scale: 1.08, opacity: 0.88 }}
          animate={shouldReduceMotion ? undefined : { scale: 1, opacity: 1 }}
          transition={shouldReduceMotion ? undefined : { duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,46,20,0.88)_0%,rgba(23,53,26,0.74)_45%,rgba(49,98,28,0.68)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8 lg:py-24">
        <MotionDiv
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
          variants={shouldReduceMotion ? undefined : heroContainerVariants}
          className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10"
        >
          <div className="max-w-3xl text-center lg:text-left">
            <MotionDiv
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90"
            >
              Plataforma ciudadana ambiental
            </MotionDiv>

            <MotionH1
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-[3.75rem]"
            >
              {title}
            </MotionH1>

            <MotionP
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="mt-5 max-w-2xl text-base leading-8 text-white/88 sm:text-lg"
            >
              {subtitle}
            </MotionP>

            <MotionDiv
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <MotionLink
                to={primaryCta.to}
                {...(shouldReduceMotion ? {} : buttonMotion)}
                className="inline-flex min-h-[46px] items-center justify-center rounded-2xl bg-[#66a939] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732]"
              >
                <span>{primaryCta.text}</span>
              </MotionLink>
              <MotionLink
                to={secondaryCta.to}
                {...(shouldReduceMotion ? {} : buttonMotion)}
                className="inline-flex min-h-[46px] items-center justify-center rounded-2xl border border-white/60 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/18"
              >
                <span>{secondaryCta.text}</span>
              </MotionLink>
            </MotionDiv>
          </div>

          <MotionDiv
            variants={shouldReduceMotion ? undefined : heroContainerVariants}
            className="grid gap-4"
          >
            {heroHighlights.map(({ icon, label, text }) => (
              <MotionArticle
                key={label}
                variants={shouldReduceMotion ? undefined : heroItemVariants}
                {...(shouldReduceMotion ? {} : cardGlowMotion)}
                className="rounded-[26px] border border-white/15 bg-white/10 p-5 shadow-[0_18px_40px_rgba(8,20,10,0.18)] backdrop-blur-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/14">
                    {React.createElement(icon, {
                      className: "h-5 w-5 text-[#dff0d0]",
                    })}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-white">{label}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/82">{text}</p>
                  </div>
                </div>
              </MotionArticle>
            ))}
          </MotionDiv>
        </MotionDiv>
      </div>
    </section>
  );
}
