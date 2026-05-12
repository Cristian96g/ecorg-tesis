import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiAlertCircle,
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiMap,
  FiMapPin,
  FiTarget,
  FiUsers,
} from "react-icons/fi";
import FeatureCard from "../components/FeatureCard";
import Hero from "../components/Hero";
import AnimatedNumber from "../components/ui/AnimatedNumber";
import { Reveal, StaggerGroup, StaggerItem } from "../components/ui/Reveal";
import SectionHero from "../components/ui/SectionHero";
import {
  buttonMotion,
  cardGlowMotion,
  fadeUpVariants,
  heroContainerVariants,
  heroItemVariants,
  hoverLift,
} from "../components/ui/motion";
import { PointsAPI, ReportsAPI } from "../api/api";

const MotionArticle = motion.article;
const MotionLink = motion(Link);
const MotionDiv = motion.div;
const MotionH2 = motion.h2;
const MotionP = motion.p;
const MotionSpan = motion.span;

const featuredSections = [
  {
    id: "mapa",
    title: "Mapa de puntos verdes",
    description:
      "Encontrá lugares cercanos para reciclar según el material.",
    icon: FiMap,
    link: "/mapa",
  },
  {
    id: "reportes",
    title: "Reportes comunitarios",
    description:
      "Informá problemas en tu barrio y ayudá a solucionarlos",
    icon: FiAlertCircle,
    link: "/reportes",
  },
  {
    id: "calendario",
    title: "Calendario de recolección",
    description:
      "Consultá días y horarios de recolección en tu zona",
    icon: FiCalendar,
    link: "/calendario",
  },
  {
    id: "educacion",
    title: "Educación ambiental",
    description:
      "Aprendé a reciclar mejor con contenido claro y simple",
    icon: FiBookOpen,
    link: "/educacion",
  },
];

const howItWorks = [
  {
    step: "01",
    icon: FiMapPin,
    title: "Buscá puntos verdes",
    description: "Encontrá dónde reciclar cerca tuyo.",
  },
  {
    step: "02",
    icon: FiAlertCircle,
    title: "Reportá problemas",
    description: "Informá situaciones ambientales en tu barrio.",
  },
  {
    step: "03",
    icon: FiAward,
    title: "Participá",
    description: "Sumate a acciones y ayudá a mejorar la ciudad.",
  },
];

const levels = [
  "Eco principiante",
  "Vecino consciente",
  "Reciclador activo",
  "Guardián ambiental",
  "Eco héroe",
];

const rankingPreview = [
  { name: "María G.", points: 180, badge: "Vecino consciente" },
  { name: "Juan P.", points: 140, badge: "Vecino consciente" },
  { name: "Carla M.", points: 95, badge: "Eco principiante" },
];

function formatMetric(value) {
  return Number(value || 0).toLocaleString("es-AR");
}

function ImpactCard({ icon: Icon, label, value, helper, tone = "green", loading = false }) {
  const shouldReduceMotion = useReducedMotion();
  const tones = {
    green: "bg-[#eef6e4] text-[#66a939]",
    amber: "bg-[#fff6df] text-[#c58a11]",
    blue: "bg-[#eef6ff] text-[#2f6ea5]",
  };

  return (
    <MotionArticle
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.18 }}
      variants={shouldReduceMotion ? undefined : fadeUpVariants}
      {...(shouldReduceMotion ? {} : hoverLift)}
      className="flex h-full flex-col rounded-[28px] border border-[#dce8ce] bg-white p-6 shadow-[0_16px_40px_rgba(59,89,34,0.08)]"
    >
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tones[tone] || tones.green}`}>
        {Icon ? <Icon className="h-6 w-6" /> : null}
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-semibold tracking-tight text-[#203014]">
        {loading ? "..." : <AnimatedNumber value={Number(value || 0)} />}
      </p>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{helper}</p>
    </MotionArticle>
  );
}

function QuickAction({ to, icon: Icon, title, description }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionLink
      to={to}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.18 }}
      variants={shouldReduceMotion ? undefined : fadeUpVariants}
      {...(shouldReduceMotion ? {} : hoverLift)}
      className="group flex h-full w-[82vw] min-w-[280px] max-w-[320px] snap-start flex-col rounded-[24px] border border-[#dce8ce] bg-white p-5 shadow-[0_16px_40px_rgba(59,89,34,0.08)] transition hover:-translate-y-0.5 hover:border-[#c7dcb0] hover:shadow-[0_18px_44px_rgba(59,89,34,0.12)] md:w-auto md:min-w-0 md:max-w-none md:p-6"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1f7e7] text-[#66a939]">
        {Icon ? <Icon className="h-6 w-6" /> : null}
      </div>
      <h3 className="mt-5 min-h-[56px] text-xl font-semibold text-[#29401a]">{title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[#5a9732]">
        Ir ahora
        <FiArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </MotionLink>
  );
}

function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [impact, setImpact] = useState({
    reports: 0,
    points: 0,
    actions: 0,
  });
  const [loadingImpact, setLoadingImpact] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadImpact() {
      try {
        setLoadingImpact(true);
        const [reportsData, pointsData] = await Promise.all([
          ReportsAPI.list({ status: "approved", limit: 100 }),
          PointsAPI.list(),
        ]);

        if (cancelled) return;

        const reports = Array.isArray(reportsData?.items) ? reportsData.items : [];
        const points = Array.isArray(pointsData) ? pointsData : pointsData?.items || [];
        const resolvedReports = reports.filter((item) => item.estado === "resuelto").length;

        setImpact({
          reports: reportsData?.total ?? reports.length,
          points: points.length,
          actions: (reportsData?.total ?? reports.length) + resolvedReports,
        });
      } catch {
        if (!cancelled) {
          setImpact({
            reports: 0,
            points: 0,
            actions: 0,
          });
        }
      } finally {
        if (!cancelled) {
          setLoadingImpact(false);
        }
      }
    }

    loadImpact();

    return () => {
      cancelled = true;
    };
  }, []);

  const impactCards = useMemo(
    () => [
      {
        label: "Reportes visibles",
        value: formatMetric(impact.reports),
        helper: "Casos comunitarios ya publicados y disponibles para consulta ciudadana.",
        icon: FiAlertCircle,
        tone: "green",
      },
      {
        label: "Puntos verdes activos",
        value: formatMetric(impact.points),
        helper: "Espacios de referencia para reciclar mejor dentro de la ciudad.",
        icon: FiMapPin,
        tone: "blue",
      },
      {
        label: "Acciones con impacto",
        value: formatMetric(impact.actions),
        helper: "Interacciones ambientales visibles que fortalecen la participación local.",
        icon: FiUsers,
        tone: "amber",
      },
    ],
    [impact]
  );

  return (
    <div className="bg-white">
      <Hero
        title="Hacé tu aporte para una Río Gallegos más limpia"
        subtitle="Encontrá puntos verdes, reportá problemas y participá en acciones reales en tu ciudad"
      />

      <section className="text-gray-900">
        <Reveal className="mx-auto max-w-screen-xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHero
            eyebrow="Impacto de la comunidad"
            title="Cada acción suma para mejorar la ciudad"
            description="Lo que hacés en EcoRG ayuda a visibilizar problemas, ubicar puntos verdes y fortalecer la participación ciudadana."
          />

          <StaggerGroup className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 xl:grid-cols-4">
            {featuredSections.map((section) => (
              <StaggerItem
                key={section.id}
                className="w-[82vw] min-w-[280px] max-w-[320px] snap-start md:w-auto md:min-w-0 md:max-w-none"
              >
                <FeatureCard
                  icon={section.icon}
                  title={section.title}
                  description={section.description}
                  link={section.link}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Reveal>
      </section>

      <section className="bg-[#fbfdf8] py-14 sm:py-16 lg:py-20">
        <Reveal className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <SectionHero
            eyebrow="Impacto de la comunidad"
            title="Cada acción registrada ayuda a construir una ciudad más ordenada y consciente"
            description="Estas métricas muestran cómo EcoRG puede visibilizar participación ciudadana, acceso al reciclaje y seguimiento ambiental en un mismo sistema."
          />

          <StaggerGroup className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
            {impactCards.map((card) => (
              <StaggerItem
                key={card.label}
                className="w-[82vw] min-w-[280px] max-w-[320px] snap-start md:w-auto md:min-w-0 md:max-w-none"
              >
                <ImpactCard {...card} loading={loadingImpact} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Reveal>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <Reveal className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.25 }}
            variants={shouldReduceMotion ? undefined : heroContainerVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <MotionSpan
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="inline-flex rounded-full border border-[#d5e6c1] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]"
            >
              Cómo funciona
            </MotionSpan>
            <MotionH2
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="mt-4 text-3xl font-semibold tracking-tight text-[#203014] sm:text-4xl"
            >
              Un recorrido simple para usar EcoRG en tu día a día
            </MotionH2>
          </MotionDiv>

          <div className="relative mt-10">
            <MotionDiv
              aria-hidden="true"
              initial={shouldReduceMotion ? false : { opacity: 0, scaleX: 0.92 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, scaleX: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={
                shouldReduceMotion
                  ? undefined
                  : { duration: 0.56, delay: 0.08, ease: [0.22, 1, 0.36, 1] }
              }
              className="absolute left-[16%] right-[16%] top-[4.65rem] hidden h-px origin-left bg-[linear-gradient(90deg,rgba(102,169,57,0.12)_0%,rgba(102,169,57,0.34)_50%,rgba(102,169,57,0.12)_100%)] md:block"
            />

            <StaggerGroup className="relative z-10 grid gap-4 md:grid-cols-3 md:gap-6">
              {howItWorks.map((item) => {
                const StepIcon = item.icon;

                return (
                  <StaggerItem key={item.step}>
                    <MotionArticle
                      variants={shouldReduceMotion ? undefined : fadeUpVariants}
                      {...(shouldReduceMotion ? {} : cardGlowMotion)}
                      className="flex h-full min-w-0 flex-col rounded-[28px] border border-[#dce8ce] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdf8_100%)] p-5 shadow-[0_16px_40px_rgba(59,89,34,0.08)] md:p-6"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <MotionDiv
                          variants={shouldReduceMotion ? undefined : fadeUpVariants}
                          className="inline-flex items-center gap-3 rounded-2xl bg-[#f2f8ea] px-3 py-2 ring-1 ring-[#dce8ce]"
                        >
                          <MotionSpan
                            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
                            whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                            transition={
                              shouldReduceMotion
                                ? undefined
                                : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                            }
                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#66a939] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(102,169,57,0.22)]"
                          >
                            {item.step}
                          </MotionSpan>
                          <div className="leading-tight">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5f8f35]">
                              Paso
                            </p>
                            <p className="text-sm font-semibold text-[#29401a]">
                              Recorrido EcoRG
                            </p>
                          </div>
                        </MotionDiv>

                        <MotionDiv
                          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
                          whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                          viewport={{ once: true, amount: 0.5 }}
                          whileHover={shouldReduceMotion ? undefined : { scale: 1.04, rotate: -2 }}
                          transition={
                            shouldReduceMotion
                              ? undefined
                              : { type: "spring", stiffness: 280, damping: 22 }
                          }
                          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939] ring-1 ring-[#dce8ce]"
                        >
                          <StepIcon className="h-5 w-5" />
                        </MotionDiv>
                      </div>

                      <h3 className="mt-5 text-xl font-semibold leading-7 text-[#29401a]">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-[28ch] text-sm leading-6 text-slate-600">
                        {item.description}
                      </p>
                    </MotionArticle>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </div>
        </Reveal>
      </section>

      <section className="bg-[#f5faee] py-14 sm:py-16 lg:py-20">
        <Reveal className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <SectionHero
            eyebrow="Gamificación"
            title="Sumá puntos ayudando a tu ciudad"
            description="Cada acción validada suma a tu progreso. Participá, ganá logros y seguí tu impacto dentro de EcoRG."
            actions={(
              <MotionLink
                to="/gamificacion"
                {...buttonMotion}
                className="inline-flex w-full min-h-[46px] items-center justify-center rounded-2xl bg-[#66a939] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732] lg:w-auto"
              >
                Ver mi progreso
              </MotionLink>
            )}
          >
            <MotionDiv
              variants={shouldReduceMotion ? undefined : heroContainerVariants}
              className="flex flex-wrap gap-2"
            >
              {levels.map((level) => (
                <MotionSpan
                  key={level}
                  variants={shouldReduceMotion ? undefined : heroItemVariants}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#4f7a2f] ring-1 ring-[#d5e6c1]"
                >
                  {level}
                </MotionSpan>
              ))}
            </MotionDiv>
          </SectionHero>

          <StaggerGroup className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
            <MotionDiv
              variants={shouldReduceMotion ? undefined : fadeUpVariants}
              {...(shouldReduceMotion ? {} : cardGlowMotion)}
              className="rounded-[30px] border border-[#dce8ce] bg-white p-6 shadow-[0_16px_40px_rgba(59,89,34,0.08)]"
            >
              <h3 className="text-2xl font-semibold text-[#203014]">Cómo ganar puntos</h3>
              <StaggerGroup className="mt-6 grid gap-4 md:grid-cols-2">
                <MotionArticle
                  variants={shouldReduceMotion ? undefined : fadeUpVariants}
                  {...(shouldReduceMotion ? {} : hoverLift)}
                  className="flex h-full flex-col rounded-[24px] border border-[#e2ecd4] bg-[#fbfdf8] p-5"
                >
                  <FiCheckCircle className="h-6 w-6 text-[#66a939]" />
                  <h4 className="mt-4 text-lg font-semibold text-[#29401a]">Reportes aprobados</h4>
                  <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
                    Cuando un administrador valida un reporte, tu participación queda reconocida dentro del sistema.
                  </p>
                </MotionArticle>
                <MotionArticle
                  variants={shouldReduceMotion ? undefined : fadeUpVariants}
                  {...(shouldReduceMotion ? {} : hoverLift)}
                  className="flex h-full flex-col rounded-[24px] border border-[#e2ecd4] bg-[#fbfdf8] p-5"
                >
                  <FiAward className="h-6 w-6 text-[#66a939]" />
                  <h4 className="mt-4 text-lg font-semibold text-[#29401a]">Logros y niveles</h4>
                  <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
                    Tu progreso crece con acciones reales, sostenidas y verificadas, no con interacción vacía.
                  </p>
                </MotionArticle>
              </StaggerGroup>
            </MotionDiv>

            <MotionDiv
              variants={shouldReduceMotion ? undefined : fadeUpVariants}
              {...(shouldReduceMotion ? {} : cardGlowMotion)}
              className="rounded-[30px] border border-[#dce8ce] bg-white p-6 shadow-[0_16px_40px_rgba(59,89,34,0.08)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
                  <FiTarget className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                    Motivación
                  </p>
                 <h3 className="mt-1 text-xl font-semibold text-[#203014]">
  Participar tiene recompensa
</h3>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-600">
                La gamificación de EcoRG no busca competir por competir, sino visibilizar aportes concretos que mejoran el ambiente urbano y fortalecen la participación ciudadana.
              </p>
            </MotionDiv>
          </StaggerGroup>
        </Reveal>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <Reveal className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
     <SectionHero
  eyebrow="Acción rápida"
  title="Empezá ahora"
  description="Accedé rápido a las acciones principales de EcoRG."
/>

          <StaggerGroup className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
            <StaggerItem>
            <QuickAction
              to="/reportes"
              icon={FiAlertCircle}
              title="Reportar un problema"
              description="Informá un mini basural o una situación ambiental con ubicación e imagen."
            />
            </StaggerItem>
            <StaggerItem>
            <QuickAction
              to="/mapa"
              icon={FiMap}
              title="Ver mapa"
              description="Buscá puntos verdes cercanos y resolvé rápido dónde llevar materiales reciclables."
            />
            </StaggerItem>
            <StaggerItem>
            <QuickAction
              to="/educacion"
              icon={FiBookOpen}
              title="Ir a educación"
              description="Accedé a contenidos claros para mejorar hábitos y entender mejor qué hacer con tus residuos."
            />
            </StaggerItem>
          </StaggerGroup>
        </Reveal>
      </section>

      <section className="bg-[#fbfdf8] py-14 sm:py-16 lg:py-20">
        <Reveal className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <SectionHero
  eyebrow="Comunidad"
  title="Personas que ya están participando"
  description="Usuarios que están ayudando a mejorar la ciudad."
/>

          <StaggerGroup className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
            {rankingPreview.map((user, index) => (
              <MotionArticle
                key={user.name}
                variants={shouldReduceMotion ? undefined : fadeUpVariants}
                {...(shouldReduceMotion ? {} : cardGlowMotion)}
                className="flex h-full w-[82vw] min-w-[280px] max-w-[320px] snap-start flex-col rounded-[28px] border border-[#dce8ce] bg-white p-6 shadow-[0_16px_40px_rgba(59,89,34,0.08)] md:w-auto md:min-w-0 md:max-w-none"
              >
                <div className="flex items-center justify-between">
                  <MotionSpan
                    variants={shouldReduceMotion ? undefined : fadeUpVariants}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#66a939] text-sm font-semibold text-white"
                  >
                    #{index + 1}
                  </MotionSpan>
                  <MotionSpan
                    variants={shouldReduceMotion ? undefined : fadeUpVariants}
                    className="rounded-full bg-[#eef6e4] px-3 py-1 text-xs font-semibold text-[#4f7a2f]"
                  >
                    {user.badge}
                  </MotionSpan>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[#29401a]">{user.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                  Participación destacada dentro del ecosistema ciudadano de EcoRG.
                </p>
                <p className="mt-auto pt-5 text-3xl font-semibold tracking-tight text-[#203014]">
                  <AnimatedNumber value={user.points} /> pts
                </p>
              </MotionArticle>
            ))}
          </StaggerGroup>
        </Reveal>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <Reveal className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.2 }}
            variants={shouldReduceMotion ? undefined : heroContainerVariants}
            className="overflow-hidden rounded-[34px] border border-[#d8e7c5] bg-[linear-gradient(135deg,#f7fbf1_0%,#eef7e2_45%,#f9fcf3_100%)] px-6 py-8 text-center shadow-[0_24px_60px_rgba(73,110,33,0.10)] sm:px-10 sm:py-10"
          >
            <MotionSpan
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="inline-flex rounded-full border border-[#cfe1b7] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#4f7a2f]"
            >
              Participá ahora
            </MotionSpan>
            <MotionH2
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="mt-4 text-3xl font-semibold tracking-tight text-[#203014] sm:text-4xl"
            >
              Tu aporte puede transformar problemas cotidianos en mejoras visibles para la ciudad
            </MotionH2>
            <MotionP
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600"
            >
              Sumate a EcoRG para reportar, reciclar, aprender y participar en una red ciudadana que convierte acciones concretas en impacto ambiental real.
            </MotionP>

            <MotionDiv
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
            >
              <MotionLink
                to="/reportes"
                {...(shouldReduceMotion ? {} : buttonMotion)}
                className="inline-flex min-h-[46px] items-center justify-center rounded-2xl bg-[#66a939] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732]"
              >
                Empezar a participar
              </MotionLink>
              <MotionLink
                to="/gamificacion"
                {...(shouldReduceMotion ? {} : buttonMotion)}
                className="inline-flex min-h-[46px] items-center justify-center rounded-2xl border border-[#cfe1b7] bg-white px-5 py-3 text-sm font-semibold text-[#4c7d26] transition hover:border-[#66a939] hover:text-[#33561a]"
              >
                Ver gamificación
              </MotionLink>
            </MotionDiv>
          </MotionDiv>
        </Reveal>
      </section>
    </div>
  );
}

export default Home;
