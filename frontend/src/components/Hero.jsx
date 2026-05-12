import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiMapPin,
  FiNavigation,
  FiTrendingUp,
} from "react-icons/fi";
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
const MotionLink = motion(Link);
const MotionImg = motion.img;

const floatingStats = [
  { label: "6 puntos verdes activos", icon: FiMapPin, position: "left-3 top-8 md:left-2 md:top-10" },
  { label: "Reportes con ubicación", icon: FiNavigation, position: "right-3 top-28 md:right-2 md:top-14" },
  { label: "Acciones con impacto", icon: FiTrendingUp, position: "left-8 bottom-6 md:left-3 md:bottom-2" },
];

const miniMapPins = [
  { top: "18%", left: "26%" },
  { top: "36%", left: "62%" },
  { top: "58%", left: "41%" },
  { top: "68%", left: "72%" },
];

const heroEase = [0.22, 1, 0.36, 1];

function getFloatAnimation(index) {
  const yOffset = index % 2 === 0 ? -3 : -2.5;
  const rotate = index % 2 === 0 ? 0.35 : -0.35;

  return {
    y: [0, yOffset, 0],
    rotate: [0, rotate, 0],
    transition: {
      duration: 7.2 + index * 0.9,
      repeat: Number.POSITIVE_INFINITY,
      ease: heroEase,
    },
  };
}

function getOrbAnimation(duration, scale = 1.08) {
  return {
    scale: [1, scale, 1],
    opacity: [0.24, 0.34, 0.24],
    transition: {
      duration,
      repeat: Number.POSITIVE_INFINITY,
      ease: heroEase,
    },
  };
}

export default function Hero({
  title = "Reportá, reciclá y mejorá Río Gallegos desde un solo lugar",
  subtitle = "EcoRG te ayuda a encontrar puntos verdes, informar problemas ambientales y seguir tu impacto en la ciudad.",
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
          transition={shouldReduceMotion ? undefined : { duration: 1.1, ease: heroEase }}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(12,34,17,0.92)_0%,rgba(18,49,23,0.82)_42%,rgba(61,118,37,0.66)_100%)]" />

        <MotionDiv
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : getOrbAnimation(11.2, 1.06)}
          className="absolute -left-12 top-12 h-44 w-44 rounded-full bg-[#8fd45c]/18 blur-3xl"
        />
        <MotionDiv
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : getOrbAnimation(12.8, 1.08)}
          className="absolute right-[16%] top-[18%] h-56 w-56 rounded-full bg-[#66a939]/18 blur-3xl"
        />
        <MotionDiv
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : getOrbAnimation(14, 1.07)}
          className="absolute bottom-0 left-[38%] h-52 w-52 rounded-full bg-[#d7f0b8]/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:flex lg:h-[calc(100vh-80px)] lg:items-center lg:px-8 lg:py-6">
        <MotionDiv
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
          variants={shouldReduceMotion ? undefined : heroContainerVariants}
          className="grid w-full items-center gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10"
        >
          <MotionDiv
            variants={shouldReduceMotion ? undefined : heroContainerVariants}
            className="max-w-3xl text-center lg:text-left"
          >
            <MotionDiv variants={shouldReduceMotion ? undefined : heroItemVariants}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-[#9fe06f]" />
                Plataforma ciudadana ambiental
              </span>
            </MotionDiv>

            <MotionH1
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.03] sm:text-5xl lg:text-[4rem]"
            >
              {title}
            </MotionH1>

            <MotionP
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="mt-5 max-w-2xl text-base leading-8 text-white/86 sm:text-lg"
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
                className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#66a939] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732]"
              >
                <span>{primaryCta.text}</span>
                <motion.span
                  animate={shouldReduceMotion ? undefined : { x: 0 }}
                  whileHover={shouldReduceMotion ? undefined : { x: 2 }}
                  className="inline-flex"
                >
                  <FiArrowRight className="h-4 w-4" />
                </motion.span>
              </MotionLink>
              <MotionLink
                to={secondaryCta.to}
                {...(shouldReduceMotion ? {} : buttonMotion)}
                className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-white/55 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/16"
              >
                <span>{secondaryCta.text}</span>
                <motion.span
                  animate={shouldReduceMotion ? undefined : { x: 0 }}
                  whileHover={shouldReduceMotion ? undefined : { x: 2 }}
                  className="inline-flex"
                >
                  <FiArrowRight className="h-4 w-4" />
                </motion.span>
              </MotionLink>
            </MotionDiv>
          </MotionDiv>

          <MotionDiv
            variants={shouldReduceMotion ? undefined : heroItemVariants}
            className="relative mx-auto w-full max-w-[410px] scale-[0.8] sm:max-w-[440px] sm:scale-[0.83] lg:mx-0 lg:max-w-[480px] lg:scale-[0.84] xl:max-w-[500px] xl:scale-[0.86]"
          >
            {floatingStats.map(({ label, icon, position }, index) => (
              <MotionDiv
                key={label}
                variants={shouldReduceMotion ? undefined : heroItemVariants}
                animate={shouldReduceMotion ? undefined : getFloatAnimation(index)}
                {...(shouldReduceMotion ? {} : cardGlowMotion)}
                className={`absolute z-20 hidden max-w-[calc(100%-1rem)] items-center gap-2 rounded-2xl border border-white/15 bg-white/12 px-3 py-2 text-xs font-medium text-white/92 shadow-[0_18px_38px_rgba(8,20,10,0.22)] backdrop-blur-md md:inline-flex ${position}`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#8ecb61]/22 text-[#dff3ce]">
                  {React.createElement(icon, { className: "h-3.5 w-3.5" })}
                </span>
                <span>{label}</span>
              </MotionDiv>
            ))}

            <MotionDiv
              initial={shouldReduceMotion ? false : { opacity: 0, y: 30, scale: 0.97 }}
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      opacity: 1,
                      y: [0, -3, 0],
                      scale: 1,
                    }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      opacity: { duration: 0.72, delay: 0.28, ease: heroEase },
                      scale: { duration: 0.72, delay: 0.28, ease: heroEase },
                      y: { duration: 8.4, repeat: Number.POSITIVE_INFINITY, ease: heroEase, delay: 1.05 },
                    }
              }
              {...(shouldReduceMotion ? {} : cardGlowMotion)}
              className="relative mx-auto w-full rounded-[34px] border border-white/15 bg-white/10 p-4 shadow-[0_28px_70px_rgba(8,20,10,0.26)] backdrop-blur-xl"
            >
              <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(217,245,189,0.18),transparent_72%)]" />

              <div className="relative rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.08)_100%)] p-3.5 lg:p-4">
                <div className="flex items-center justify-between rounded-[20px] border border-white/10 bg-[#133019]/60 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">EcoRG</p>
                    <p className="mt-1 text-sm font-semibold text-white">Panel ciudadano</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-[#7cc34a]/18 px-3 py-1 text-[11px] font-semibold text-[#def4c7]">
                    <FiCheckCircle className="h-3.5 w-3.5" />
                    Activo
                  </div>
                </div>

                <div className="mt-3 grid gap-3 lg:grid-cols-[1.02fr_0.98fr]">
                  <div className="rounded-[24px] border border-white/10 bg-[#0f2714]/68 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Mapa de puntos verdes</p>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/72">
                        Rí­o Gallegos
                      </span>
                    </div>
                    <div className="relative mt-3 h-32 overflow-hidden rounded-[20px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(159,224,111,0.18),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] lg:h-36">
                      <div className="absolute inset-x-0 top-[30%] h-px bg-white/10" />
                      <div className="absolute left-[34%] top-0 h-full w-px bg-white/10" />
                      <div className="absolute left-[67%] top-0 h-full w-px bg-white/10" />
                      <div className="absolute inset-x-0 top-[64%] h-px bg-white/10" />
                      <div className="absolute inset-x-5 top-[26%] h-24 rounded-full border border-dashed border-[#8ed05d]/24" />

                      {miniMapPins.map((pin, index) => (
                        <MotionDiv
                          key={`${pin.left}-${pin.top}`}
                          animate={
                            shouldReduceMotion || index > 0
                              ? undefined
                              : {
                                  scale: [1, 1.03, 1],
                                  opacity: [0.9, 0.98, 0.9],
                                }
                          }
                          transition={
                            shouldReduceMotion || index > 0
                              ? undefined
                              : {
                                  duration: 6.2 + index * 0.6,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: heroEase,
                                }
                          }
                          className="absolute"
                          style={{ top: pin.top, left: pin.left }}
                        >
                          <div className="relative flex h-5 w-5 items-center justify-center">
                            <div className="absolute h-5 w-5 rounded-full bg-[#91d661]/30" />
                            <div className="relative h-3.5 w-3.5 rounded-full bg-[#9fe06f] shadow-[0_0_0_4px_rgba(159,224,111,0.18)]" />
                          </div>
                        </MotionDiv>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="rounded-[24px] border border-white/10 bg-[#123019]/70 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">Reporte ambiental</p>
                          <p className="mt-1 text-xs text-white/68">Contenedor saturado en zona centro</p>
                        </div>
                        <span className="rounded-full bg-[#7cc34a]/18 px-2.5 py-1 text-[11px] font-semibold text-[#def4c7]">
                          Nuevo
                        </span>
                      </div>
                      <div className="mt-3 rounded-[18px] border border-white/8 bg-white/6 px-3 py-2.5 text-xs leading-5 text-white/78">
                        Con ubicación precisa e imagen para que el equipo pueda revisarlo rÃ¡pido.
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-[#102c17]/74 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">Impacto ciudadano</p>
                          <p className="mt-1 text-xs text-white/66">Puntos y participación</p>
                        </div>
                        <div className="rounded-2xl bg-white/8 px-3 py-2 text-right">
                          <p className="text-lg font-semibold text-white">+120</p>
                          <p className="text-[11px] text-white/60">puntos</p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div>
                          <div className="mb-1.5 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-white/58">
                            <span>Avance semanal</span>
                            <span>78%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <MotionDiv
                              initial={shouldReduceMotion ? false : { width: 0 }}
                              animate={shouldReduceMotion ? undefined : { width: "78%" }}
                              transition={shouldReduceMotion ? undefined : { duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                              className="h-full rounded-full bg-[linear-gradient(90deg,#8ed05d_0%,#d7f0b8_100%)]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-[18px] border border-white/8 bg-white/6 px-3 py-3">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-white/56">Reportes</p>
                            <p className="mt-1 text-base font-semibold text-white">24</p>
                          </div>
                          <div className="rounded-[18px] border border-white/8 bg-white/6 px-3 py-3">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-white/56">Reciclaje</p>
                            <p className="mt-1 text-base font-semibold text-white">12 kg</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        </MotionDiv>
      </div>
    </section>
  );
}
