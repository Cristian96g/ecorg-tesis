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
    description: (
      <>
        <span className="md:hidden">Encontrá dónde reciclar cerca tuyo.</span>
        <span className="hidden md:inline">
          Encontrá lugares cercanos para reciclar según el material.
        </span>
      </>
    ),
    icon: FiMap,
    link: "/mapa",
  },
  {
    id: "reportes",
    title: "Reportes comunitarios",
    description: (
      <>
        <span className="md:hidden">Informá problemas en tu barrio.</span>
        <span className="hidden md:inline">
          Informá problemas en tu barrio y ayudá a visibilizar lo que necesita atención.
        </span>
      </>
    ),
    icon: FiAlertCircle,
    link: "/reportes",
  },
  {
    id: "calendario",
    title: "Calendario de recolección",
    description: (
      <>
        <span className="md:hidden">Consultá horarios en tu zona.</span>
        <span className="hidden md:inline">
          Consultá días y horarios de recolección para organizar mejor tus residuos.
        </span>
      </>
    ),
    icon: FiCalendar,
    link: "/calendario",
  },
  {
    id: "educacion",
    title: "Educación ambiental",
    description: (
      <>
        <span className="md:hidden">Aprendé a reciclar mejor.</span>
        <span className="hidden md:inline">
          Aprendé con contenidos claros para mejorar hábitos y reciclar mejor.
        </span>
      </>
    ),
    icon: FiBookOpen,
    link: "/educacion",
  },
];

const rewardJourney = [
  {
    title: "Ganás puntos",
    description:
      "Participá en acciones ecológicas, enviá reportes responsables y completá desafíos ambientales.",
    icon: FiAward,
  },
  {
    title: "Desbloqueás beneficios",
    description:
      "Accedé a descuentos, recompensas y promociones sustentables dentro del ecosistema EcoRG.",
    icon: FiCheckCircle,
  },
  {
    title: "Apoyás comercios locales",
    description:
      "EcoRG conecta participación ciudadana con comercios comprometidos con un impacto más consciente.",
    icon: FiUsers,
  },
];

const rewardsPreview = [
  {
    title: "15% OFF en café de especialidad",
    partner: "Café del Centro",
    points: 250,
    benefit: "Beneficio activo",
  },
  {
    title: "Descuento en cuadernos reciclados",
    partner: "Librería Horizonte",
    points: 320,
    benefit: "Comercio adherido",
  },
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
      className="flex h-full flex-col rounded-[22px] border border-[#dce8ce] bg-white p-3.5 shadow-[0_14px_34px_rgba(59,89,34,0.08)] md:rounded-[28px] md:p-6 md:shadow-[0_16px_40px_rgba(59,89,34,0.08)]"
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-[18px] ${tones[tone] || tones.green} md:h-14 md:w-14 md:rounded-2xl`}
      >
        {Icon ? <Icon className="h-5 w-5 md:h-6 md:w-6" /> : null}
      </div>
      <p className="mt-3 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-[1.85rem] font-semibold tracking-tight text-[#203014] md:mt-2 md:text-4xl">
        {loading ? "..." : <AnimatedNumber value={Number(value || 0)} />}
      </p>
      <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-slate-600 md:mt-3 md:line-clamp-3 md:leading-6">
        {helper}
      </p>
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
      className="group flex h-full w-[78vw] min-w-[248px] max-w-[286px] snap-start flex-col rounded-[22px] border border-[#dce8ce] bg-white p-4 shadow-[0_14px_34px_rgba(59,89,34,0.08)] transition hover:border-[#c7dcb0] hover:shadow-[0_18px_44px_rgba(59,89,34,0.12)] md:w-auto md:min-w-0 md:max-w-none md:rounded-[24px] md:p-6 md:shadow-[0_16px_40px_rgba(59,89,34,0.08)]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#f1f7e7] text-[#66a939] md:h-14 md:w-14 md:rounded-2xl">
        {Icon ? <Icon className="h-5 w-5 md:h-6 md:w-6" /> : null}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[#29401a] md:mt-5 md:min-h-[56px] md:text-xl">
        {title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600 md:mt-3 md:line-clamp-3 md:leading-6">
        {description}
      </p>
      <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-[#5a9732] md:pt-5">
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
        helper: (
          <>
            <span className="md:hidden">Casos publicados para consulta.</span>
            <span className="hidden md:inline">
              Casos comunitarios ya publicados y disponibles para consulta ciudadana.
            </span>
          </>
        ),
        icon: FiAlertCircle,
        tone: "green",
      },
      {
        label: "Puntos verdes activos",
        value: formatMetric(impact.points),
        helper: (
          <>
            <span className="md:hidden">Lugares activos para reciclar.</span>
            <span className="hidden md:inline">
              Espacios de referencia para reciclar mejor dentro de la ciudad.
            </span>
          </>
        ),
        icon: FiMapPin,
        tone: "blue",
      },
      {
        label: "Acciones con impacto",
        value: formatMetric(impact.actions),
        helper: (
          <>
            <span className="md:hidden">Acciones que mejoran la ciudad.</span>
            <span className="hidden md:inline">
              Interacciones ambientales visibles que fortalecen la participación local.
            </span>
          </>
        ),
        icon: FiUsers,
        tone: "amber",
      },
    ],
    [impact]
  );

  return (
    <div className="bg-[#f6f8f2]">
      <Hero
        title={
          <>
            <span className="md:hidden">Reciclá y mejorá Río Gallegos</span>
            <span className="hidden md:inline">Hacé tu aporte para una Río Gallegos más limpia</span>
          </>
        }
        subtitle={
          <>
            <span className="md:hidden">Puntos verdes, reportes y acciones en un solo lugar.</span>
            <span className="hidden md:inline">
              Encontrá puntos verdes, reportá problemas y participá en acciones reales en tu ciudad.
            </span>
          </>
        }
      />

      <section className="bg-white text-gray-900">
        <Reveal className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
          <SectionHero
            eyebrow="Funciones principales"
            title={
              <>
                <span className="md:hidden">Todo lo esencial en un mismo lugar.</span>
                <span className="hidden md:inline">Lo esencial de EcoRG para usar la plataforma rápido</span>
              </>
            }
            description={
              <>
                <span className="md:hidden">Mapa, reportes, calendario y educación sin vueltas.</span>
                <span className="hidden md:inline">
                  Mapa, reportes, calendario y educación ambiental para resolver acciones concretas sin pasar por una home explicativa de más.
                </span>
              </>
            }
            className="border-[#dfe9d3] bg-[linear-gradient(135deg,#ffffff_0%,#f8fbf4_100%)] shadow-[0_22px_54px_rgba(73,110,33,0.08)]"
          />

          <StaggerGroup className="mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 md:mt-10 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 xl:grid-cols-4">
            {featuredSections.map((section, index) => (
              <StaggerItem
                key={section.id}
                className={`w-[74vw] min-w-[232px] max-w-[268px] snap-start md:w-auto md:min-w-0 md:max-w-none ${index === 3 ? "hidden sm:block" : ""}`}
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

      <section className="bg-[radial-gradient(circle_at_top_right,rgba(143,196,106,0.12),transparent_32%),linear-gradient(180deg,#eef5e7_0%,#f6f8f2_100%)] py-8 sm:py-14 lg:py-20">
        <Reveal className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <SectionHero
            eyebrow="Impacto ciudadano"
            title={
              <>
                <span className="md:hidden">Impacto visible en un vistazo.</span>
                <span className="hidden md:inline">El impacto ciudadano se ve rápido en datos claros</span>
              </>
            }
            description={
              <>
                <span className="md:hidden">Reportes, puntos verdes y acciones en un vistazo.</span>
                <span className="hidden md:inline">
                  Un resumen corto para entender cómo EcoRG ordena reportes, reciclaje y participación ciudadana sin explicaciones de más.
                </span>
              </>
            }
            className="border-[#d6e4c9] bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,rgba(247,251,241,0.88)_100%)] shadow-[0_24px_56px_rgba(73,110,33,0.08)]"
          />

          <StaggerGroup className="mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 md:mt-10 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
            {impactCards.map((card) => (
              <StaggerItem
                key={card.label}
                className="w-[74vw] min-w-[232px] max-w-[268px] snap-start md:w-auto md:min-w-0 md:max-w-none"
              >
                <ImpactCard {...card} loading={loadingImpact} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Reveal>
      </section>

      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#eef5e7_100%)] py-8 sm:py-14 lg:py-20">
        <Reveal className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <SectionHero
            eyebrow="EcoPoints y beneficios"
            title="Tu impacto también tiene recompensa"
            description="Sumá EcoPoints reciclando, reportando problemas ambientales y participando en acciones ecológicas. Luego podés canjearlos por beneficios en comercios adheridos."
            className="border-[#d4e2c7] bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,rgba(244,248,238,0.94)_100%)] shadow-[0_24px_58px_rgba(73,110,33,0.08)]"
            actions={
              <div className="flex w-full flex-col gap-2.5 sm:flex-row lg:w-auto">
                <MotionLink
                  to="/registrarse"
                  {...(shouldReduceMotion ? {} : buttonMotion)}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-2xl bg-[#66a939] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732]"
                >
                  Registrarme y sumar puntos
                </MotionLink>
                <MotionLink
                  to="/gamificacion"
                  {...(shouldReduceMotion ? {} : buttonMotion)}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-2xl border border-[#d7e5c5] bg-white px-5 py-3 text-sm font-semibold text-[#35561a] transition hover:bg-[#f7fbf1]"
                >
                  Ver beneficios
                </MotionLink>
              </div>
            }
          />

          <div className="mt-7 grid gap-3 md:mt-8 md:gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <StaggerGroup className="grid gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-1">
              {rewardJourney.map((item) => {
                const Icon = item.icon;

                return (
                  <StaggerItem key={item.title}>
                    <MotionArticle
                      {...(shouldReduceMotion ? {} : hoverLift)}
                      className="flex h-full flex-col rounded-[22px] border border-[#dce8ce] bg-white p-3.5 shadow-[0_14px_34px_rgba(59,89,34,0.08)] sm:rounded-[28px] sm:p-5"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-3 text-base font-semibold text-[#203014] sm:mt-4 sm:text-lg">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-5 text-slate-600 sm:mt-2 sm:leading-6">{item.description}</p>
                    </MotionArticle>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>

            <StaggerGroup className="grid gap-3 md:gap-4">
              <MotionDiv
                variants={shouldReduceMotion ? undefined : fadeUpVariants}
                {...(shouldReduceMotion ? {} : cardGlowMotion)}
                className="rounded-[24px] border border-[#dce8ce] bg-[#2d3d33] p-4 text-white shadow-[0_18px_44px_rgba(45,61,51,0.18)] sm:rounded-[28px] sm:p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/88">
                    Beneficios adheridos
                  </span>
                  <span className="rounded-full bg-[#66a939] px-3 py-1 text-xs font-semibold text-white">
                    Impacto con retorno real
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4">
                  {rewardsPreview.map((reward) => (
                    <article
                      key={reward.title}
                      className="rounded-[20px] border border-white/10 bg-white/8 p-3.5 backdrop-blur-sm sm:rounded-[22px] sm:p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center rounded-full bg-white/12 px-2.5 py-1 text-xs font-semibold text-white/90">
                          {reward.points} EcoPoints
                        </span>
                        <span className="inline-flex rounded-full bg-[#eef6e4] px-2.5 py-1 text-xs font-semibold text-[#35561a]">
                          {reward.benefit}
                        </span>
                      </div>
                      <h3 className="mt-3 text-[15px] font-semibold text-white sm:mt-4 sm:text-base">{reward.title}</h3>
                      <p className="mt-1.5 text-sm text-white/72 sm:mt-2">{reward.partner}</p>
                    </article>
                  ))}
                </div>

                <div className="mt-4 rounded-[20px] border border-white/10 bg-white/8 p-3.5 backdrop-blur-sm sm:mt-5 sm:rounded-[22px] sm:p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                    Enfoque EcoRG
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/78">
                    Los EcoPoints no buscan empujar consumo por consumo: acompañan la participación ambiental, incentivan hábitos sostenibles y fortalecen una red local de comercios comprometidos.
                  </p>
                </div>
              </MotionDiv>
            </StaggerGroup>
          </div>
        </Reveal>
      </section>

      <section className="hidden bg-white py-10 sm:py-14 md:block lg:py-20">
        <Reveal className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <SectionHero
            eyebrow="Empezá ahora"
            title="Acciones concretas para empezar hoy"
            description="Accedé rápido a las acciones principales de EcoRG sin pasar por pantallas intermedias."
            className="border-[#dfe9d3] bg-[linear-gradient(135deg,#ffffff_0%,#f7fbf1_100%)] shadow-[0_22px_54px_rgba(73,110,33,0.08)]"
          />

          <StaggerGroup className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:mt-10 sm:gap-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
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

      <section className="bg-[linear-gradient(180deg,#f6f8f2_0%,#eef5e7_100%)] py-8 sm:py-14 lg:py-20">
        <Reveal className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.2 }}
            variants={shouldReduceMotion ? undefined : heroContainerVariants}
            className="overflow-hidden rounded-[24px] border border-[#3f5446] bg-[linear-gradient(135deg,#2d3d33_0%,#314536_55%,#466235_100%)] px-4 py-5 text-center shadow-[0_18px_40px_rgba(45,61,51,0.16)] sm:rounded-[34px] sm:px-10 sm:py-10 sm:shadow-[0_24px_56px_rgba(45,61,51,0.16)]"
          >
            <MotionSpan
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="inline-flex rounded-full border border-white/14 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90"
            >
              Participá ahora
            </MotionSpan>
            <MotionH2
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="mt-2.5 text-[1.7rem] font-semibold tracking-tight text-white sm:mt-4 sm:text-4xl"
            >
              <span className="md:hidden">Tu aporte puede mejorar la ciudad.</span>
              <span className="hidden md:inline">
                Tu aporte puede transformar problemas cotidianos en mejoras visibles para la ciudad.
              </span>
            </MotionH2>
            <MotionP
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="mx-auto mt-2.5 max-w-xl text-sm leading-5.5 text-white/88 sm:mt-4 sm:max-w-2xl sm:text-base sm:leading-7"
            >
              <span className="md:hidden">Reportá, reciclá y participá desde un solo lugar.</span>
              <span className="hidden md:inline">
                Sumate a EcoRG para reportar, reciclar, aprender y participar en una red ciudadana que convierte acciones concretas en impacto ambiental real.
              </span>
            </MotionP>

            <MotionDiv
              variants={shouldReduceMotion ? undefined : heroItemVariants}
              className="mt-5 flex flex-col justify-center gap-2.5 sm:mt-8 sm:flex-row sm:gap-3"
            >
              <MotionLink
                to="/reportes"
                {...(shouldReduceMotion ? {} : buttonMotion)}
                className="inline-flex min-h-[46px] items-center justify-center rounded-2xl bg-[#66a939] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(45,61,51,0.14)] transition hover:bg-[#5a9732]"
              >
                Empezar a participar
              </MotionLink>
              <MotionLink
                to="/gamificacion"
                {...(shouldReduceMotion ? {} : buttonMotion)}
                className="inline-flex min-h-[46px] items-center justify-center rounded-2xl border border-white/18 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8 hover:border-white/26"
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
