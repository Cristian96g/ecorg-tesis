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

function ProductMapPreview({ shouldReduceMotion, compact = false }) {
  return (
    <div
      className={`relative overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(159,224,111,0.18),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] ${
        compact ? "mt-3 h-24 rounded-[16px]" : "mt-3 h-24 rounded-[18px] sm:h-28 lg:h-36"
      }`}
    >
      <div className="absolute inset-x-0 top-[30%] h-px bg-white/10" />
      <div className="absolute left-[34%] top-0 h-full w-px bg-white/10" />
      <div className="absolute left-[67%] top-0 h-full w-px bg-white/10" />
      <div className="absolute inset-x-0 top-[64%] h-px bg-white/10" />
      <div className={`absolute rounded-full border border-dashed border-[#8ed05d]/24 ${compact ? "inset-x-4 top-[24%] h-24" : "inset-x-5 top-[26%] h-24"}`} />

      {(compact ? miniMapPins.slice(0, 3) : miniMapPins).map((pin, index) => (
        <MotionDiv
          key={`${compact ? "mobile" : "desktop"}-${pin.left}-${pin.top}`}
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
                  duration: compact ? 6.4 : 6.2 + index * 0.6,
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
  );
}

function MobileHeroPreview({ shouldReduceMotion }) {
  return (
    <MotionDiv
      variants={shouldReduceMotion ? undefined : heroItemVariants}
      className="w-full lg:hidden"
    >
      <MotionDiv
        initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? undefined : { duration: 0.68, delay: 0.28, ease: heroEase }}
        {...(shouldReduceMotion ? {} : cardGlowMotion)}
        className="mx-auto max-w-sm overflow-hidden rounded-[28px] border border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.10)_100%)] p-3 shadow-[0_22px_54px_rgba(8,20,10,0.22)] ring-1 ring-white/8 backdrop-blur-xl"
      >
        <div className="rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.08)_100%)] p-3">
          <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-[#133019]/60 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">EcoRG</p>
              <p className="mt-1 text-sm font-semibold text-white">Vista rápida</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#7cc34a]/18 px-2.5 py-1 text-[11px] font-semibold text-[#def4c7]">
              <FiCheckCircle className="h-3.5 w-3.5" />
              Activo
            </span>
          </div>

          <div className="mt-3 grid gap-3">
            <div className="rounded-[18px] border border-white/10 bg-[#0f2714]/68 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">Puntos verdes cerca tuyo</p>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/72">
                  6 activos
                </span>
              </div>
              <ProductMapPreview shouldReduceMotion={shouldReduceMotion} compact />
            </div>

            <div className="grid grid-cols-[1.15fr_0.85fr] gap-3">
              <div className="rounded-[18px] border border-white/10 bg-[#123019]/70 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-white">Reporte nuevo</p>
                    <p className="mt-1 text-xs text-white/68">Zona centro</p>
                  </div>
                  <span className="rounded-full bg-[#7cc34a]/18 px-2 py-1 text-[10px] font-semibold text-[#def4c7]">
                    Ubicado
                  </span>
                </div>
                <p className="mt-2 text-[11px] leading-[1.35] text-white/78">
                  Con ubicación precisa e imagen para seguimiento rápido.
                </p>
              </div>

              <div className="rounded-[18px] border border-white/10 bg-[#102c17]/74 p-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/56">EcoPoints</p>
                <p className="mt-1 text-xl font-semibold text-white">+120</p>
                <p className="mt-1 text-xs text-white/66">Impacto visible</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <MotionDiv
                    initial={shouldReduceMotion ? false : { width: 0 }}
                    animate={shouldReduceMotion ? undefined : { width: "78%" }}
                    transition={shouldReduceMotion ? undefined : { duration: 0.9, delay: 0.42, ease: heroEase }}
                    className="h-full rounded-full bg-[linear-gradient(90deg,#8ed05d_0%,#d7f0b8_100%)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </MotionDiv>
    </MotionDiv>
  );
}

function DesktopHeroMockup({ shouldReduceMotion }) {
  return (
    <MotionDiv
      variants={shouldReduceMotion ? undefined : heroItemVariants}
      className="relative mx-auto hidden w-full lg:mx-0 lg:block lg:max-w-[480px] lg:scale-[0.84] xl:max-w-[500px] xl:scale-[0.86]"
    >
      <div className="absolute inset-x-[10%] top-[8%] h-[72%] rounded-[40px] bg-[radial-gradient(circle_at_center,rgba(143,196,106,0.34),rgba(102,169,57,0.12)_48%,transparent_78%)] blur-3xl" />
      {floatingStats.map(({ label, icon, position }, index) => (
        <MotionDiv
          key={label}
          variants={shouldReduceMotion ? undefined : heroItemVariants}
          animate={shouldReduceMotion ? undefined : getFloatAnimation(index)}
          {...(shouldReduceMotion ? {} : cardGlowMotion)}
          className={`absolute z-20 hidden max-w-[calc(100%-1rem)] items-center gap-2 rounded-2xl border border-white/16 bg-white/14 px-3 py-2 text-xs font-medium text-white/95 shadow-[0_20px_44px_rgba(8,20,10,0.24)] backdrop-blur-md md:inline-flex ${position}`}
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
        className="relative mx-auto w-full rounded-[30px] border border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.09)_100%)] p-3 shadow-[0_26px_64px_rgba(8,20,10,0.28)] ring-1 ring-white/8 backdrop-blur-xl sm:rounded-[34px] sm:p-4"
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(217,245,189,0.24),transparent_72%)]" />

        <div className="relative rounded-[24px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.08)_100%)] p-3 lg:p-4">
          <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-[#133019]/60 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:px-4 sm:py-3">
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
            <div className="rounded-[20px] border border-white/10 bg-[#0f2714]/68 p-3 sm:rounded-[24px] sm:p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Mapa de puntos verdes</p>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/72">
                  Río Gallegos
                </span>
              </div>
              <ProductMapPreview shouldReduceMotion={shouldReduceMotion} />
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="rounded-[20px] border border-white/10 bg-[#123019]/70 p-3 sm:rounded-[24px] sm:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Reporte ambiental</p>
                    <p className="mt-1 text-xs text-white/68">Contenedor saturado en zona centro</p>
                  </div>
                  <span className="rounded-full bg-[#7cc34a]/18 px-2.5 py-1 text-[11px] font-semibold text-[#def4c7]">
                    Nuevo
                  </span>
                </div>
                <div className="mt-3 rounded-[16px] border border-white/8 bg-white/6 px-3 py-2 text-[11px] leading-[1.35] text-white/78 sm:rounded-[18px] sm:py-2.5 sm:text-xs sm:leading-5">
                  Con ubicación precisa e imagen para que el equipo pueda revisarlo rápido.
                </div>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-[#102c17]/74 p-3 sm:rounded-[24px] sm:p-4">
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

                <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-white/58">
                      <span>Avance semanal</span>
                      <span>78%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <MotionDiv
                        initial={shouldReduceMotion ? false : { width: 0 }}
                        animate={shouldReduceMotion ? undefined : { width: "78%" }}
                        transition={shouldReduceMotion ? undefined : { duration: 0.9, delay: 0.55, ease: heroEase }}
                        className="h-full rounded-full bg-[linear-gradient(90deg,#8ed05d_0%,#d7f0b8_100%)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="rounded-[16px] border border-white/8 bg-white/6 px-3 py-2.5 sm:rounded-[18px] sm:py-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-white/56">Reportes</p>
                      <p className="mt-1 text-base font-semibold text-white">24</p>
                    </div>
                    <div className="rounded-[16px] border border-white/8 bg-white/6 px-3 py-2.5 sm:rounded-[18px] sm:py-3">
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
  );
}

export default function Hero({
  title = "Reportá, reciclá y mejorá Río Gallegos desde un solo lugar",
  subtitle = "EcoRG te ayuda a encontrar puntos verdes, informar problemas ambientales y seguir tu impacto en la ciudad.",
  primaryCta = { text: "Ver puntos verdes", to: "/mapa" },
  secondaryCta = { text: "Reportar problema", to: "/reportes" },
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#eef5e7] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(143,196,106,0.26),transparent_26%),radial-gradient(circle_at_85%_12%,rgba(102,169,57,0.24),transparent_22%),radial-gradient(circle_at_58%_88%,rgba(214,236,188,0.28),transparent_22%),linear-gradient(135deg,#f6f8f2_0%,#eef5e7_24%,#dfead4_58%,#d2e2c5_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(45,61,51,0.86)_0%,rgba(45,61,51,0.78)_30%,rgba(61,102,48,0.62)_58%,rgba(102,169,57,0.34)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_38%,rgba(255,255,255,0.1),transparent_34%),radial-gradient(circle_at_78%_32%,rgba(212,242,186,0.16),transparent_24%)]" />
        <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:84px_84px] sm:[background-size:96px_96px]" />
        <div className="absolute inset-x-[8%] top-[16%] h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.34),transparent)]" />
        <div className="absolute inset-x-[14%] top-[54%] hidden h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.24),transparent)] lg:block" />
        <div className="absolute left-[12%] top-[18%] h-28 w-28 rounded-full bg-white/8 blur-3xl" />
        <MotionDiv
          aria-hidden="true"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? undefined : { duration: 0.9, delay: 0.18, ease: heroEase }}
          className="absolute right-[6%] top-[10%] hidden h-[280px] w-[280px] rounded-[36px] border border-white/12 bg-white/[0.06] shadow-[0_20px_64px_rgba(22,35,28,0.12)] backdrop-blur-[3px] lg:block"
        />
        <MotionDiv
          aria-hidden="true"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? undefined : { duration: 0.9, delay: 0.26, ease: heroEase }}
          className="absolute left-[10%] top-[62%] hidden h-[180px] w-[220px] rounded-[32px] border border-white/12 bg-white/[0.05] shadow-[0_18px_54px_rgba(22,35,28,0.12)] backdrop-blur-[3px] lg:block"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_46%,rgba(12,28,18,0.16)_100%)]" />

        <MotionDiv
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : getOrbAnimation(11.2, 1.06)}
          className="absolute -left-10 top-10 h-44 w-44 rounded-full bg-[#8fc46a]/28 blur-3xl"
        />
        <MotionDiv
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : getOrbAnimation(12.8, 1.08)}
          className="absolute right-[14%] top-[14%] h-64 w-64 rounded-full bg-[#66a939]/24 blur-3xl"
        />
        <MotionDiv
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : getOrbAnimation(14, 1.07)}
          className="absolute bottom-[-4%] left-[34%] h-56 w-56 rounded-full bg-[#d7f0b8]/15 blur-3xl"
        />
        <MotionDiv
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : getOrbAnimation(13.6, 1.05)}
          className="absolute bottom-[12%] right-[26%] h-44 w-44 rounded-full bg-[#eef5e7]/12 blur-3xl"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 sm:py-14 md:py-16 lg:flex lg:h-[calc(100vh-80px)] lg:items-center lg:px-8 lg:py-6">
        <MotionDiv
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
          variants={shouldReduceMotion ? undefined : heroContainerVariants}
          className="grid w-full items-center gap-5 sm:gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10"
        >
          <MotionDiv
            variants={shouldReduceMotion ? undefined : heroContainerVariants}
            className="max-w-3xl text-center lg:text-left"
          >
            <MotionDiv variants={shouldReduceMotion ? undefined : heroItemVariants}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/22 bg-white/12 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/95 shadow-[0_8px_24px_rgba(16,28,20,0.12)] backdrop-blur-sm sm:text-xs">
                <span className="h-2.5 w-2.5 rounded-full bg-[#9fe06f]" />
                Plataforma ciudadana ambiental
              </span>
            </MotionDiv>

            <MotionH1
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="mt-3 max-w-3xl text-[1.8rem] font-semibold leading-[1.05] text-white drop-shadow-[0_10px_28px_rgba(18,30,22,0.24)] sm:mt-5 sm:text-[2.8rem] lg:text-[4rem]"
            >
              {title}
            </MotionH1>

            <MotionP
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="mt-3 max-w-xl text-sm leading-[1.45] text-white/90 drop-shadow-[0_6px_22px_rgba(18,30,22,0.18)] sm:mt-5 sm:max-w-2xl sm:text-base sm:leading-7 lg:text-lg lg:leading-8"
            >
              {subtitle}
            </MotionP>

            <MotionDiv
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="mt-5 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:justify-center sm:gap-3 lg:justify-start"
            >
              <MotionLink
                to={primaryCta.to}
                {...(shouldReduceMotion ? {} : buttonMotion)}
                className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#7cc34a_0%,#66a939_60%,#5a9732_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(45,61,51,0.18)] transition hover:shadow-[0_18px_40px_rgba(45,61,51,0.22)]"
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
                className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-white/22 bg-white/14 px-5 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition hover:bg-white/20 hover:border-white/30"
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

          <MobileHeroPreview shouldReduceMotion={shouldReduceMotion} />
          <DesktopHeroMockup shouldReduceMotion={shouldReduceMotion} />
        </MotionDiv>
      </div>
    </section>
  );
}
