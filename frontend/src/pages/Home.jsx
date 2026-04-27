import React, { useEffect, useMemo, useState } from "react";
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
import SectionHero from "../components/ui/SectionHero";
import { PointsAPI, ReportsAPI } from "../api/api";

const featuredSections = [
  {
    id: "mapa",
    title: "Mapa de puntos verdes",
    description:
      "Encontra lugares de reciclaje en Rí­o Gallegos y filtra por material para resolver rapido dande llevar tus residuos.",
    icon: FiMap,
    link: "/mapa",
  },
  {
    id: "reportes",
    title: "Reportes comunitarios",
    description:
      "Informa mini basurales o problemas ambientales con una ubicacian clara para colaborar con una ciudad mas limpia.",
    icon: FiAlertCircle,
    link: "/reportes",
  },
  {
    id: "calendario",
    title: "Calendario de recoleccian",
    description:
      "Consulta dpi­as y horarios de recoleccian diferenciada por barrio para organizar mejor tus residuos.",
    icon: FiCalendar,
    link: "/calendario",
  },
  {
    id: "educacion",
    title: "Educacian ambiental",
    description:
      "Acceda a guis breves y consejos practicos para reciclar mejor y sumar habitos mas sustentables.",
    icon: FiBookOpen,
    link: "/educacion",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Busca puntos verdes cercanos",
    description:
      "Usa el mapa para ubicar lugares de reciclaje segun el tipo de material que queras separar.",
  },
  {
    step: "02",
    title: "Reporta problemas ambientales",
    description:
      "Si detectas un mini basural o una situacian ambiental, registrala para que pueda visualizarse y gestionarse mejor.",
  },
  {
    step: "03",
    title: "Aprenda y participa en tu ciudad",
    description:
      "Consulta contenidos educativos y horarios de recoleccian para transformar la informacian en acciones concretas.",
  },
];

const levels = [
  "Eco principiante",
  "Vecino consciente",
  "Reciclador activo",
  "Guardian ambiental",
  "Eco haroe",
];

const rankingPreview = [
  { name: "Marí­a G.", points: 180, badge: "Vecino consciente" },
  { name: "Juan P.", points: 140, badge: "Vecino consciente" },
  { name: "Carla M.", points: 95, badge: "Eco principiante" },
];

function formatMetric(value) {
  return Number(value || 0).toLocaleString("es-AR");
}

function ImpactCard({ icon: Icon, label, value, helper, tone = "green", loading = false }) {
  const tones = {
    green: "bg-[#eef6e4] text-[#66a939]",
    amber: "bg-[#fff6df] text-[#c58a11]",
    blue: "bg-[#eef6ff] text-[#2f6ea5]",
  };

  return (
    <article className="rounded-[28px] border border-[#dce8ce] bg-white p-6 shadow-[0_16px_40px_rgba(59,89,34,0.08)]">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tones[tone] || tones.green}`}>
        {Icon ? <Icon className="h-6 w-6" /> : null}
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-semibold tracking-tight text-[#203014]">
        {loading ? "..." : value}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{helper}</p>
    </article>
  );
}

function QuickAction({ to, icon: Icon, title, description }) {
  return (
    <Link
      to={to}
      className="group flex h-full w-[calc((100vw-4rem)/2)] min-w-[145px] max-w-[170px] snap-start flex-col rounded-[24px] border border-[#dce8ce] bg-white p-5 shadow-[0_16px_40px_rgba(59,89,34,0.08)] transition hover:-translate-y-0.5 hover:border-[#c7dcb0] hover:shadow-[0_18px_44px_rgba(59,89,34,0.12)] md:w-auto md:min-w-0 md:max-w-none md:p-6"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1f7e7] text-[#66a939]">
        {Icon ? <Icon className="h-6 w-6" /> : null}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-[#29401a]">{title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#5a9732]">
        Ir ahora
        <FiArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function Home() {
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
        helper: "Interacciones ambientales visibles que fortalecen la participacian local.",
        icon: FiUsers,
        tone: "amber",
      },
    ],
    [impact]
  );

  return (
    <div className="bg-white">
      <Hero
        title="EcoRG: acciones cotidianas para una Rí­o Gallegos mas limpia y participativa"
        subtitle="Encontra puntos verdes, reporta problemas ambientales, aprenda sobre reciclaje y convertÃí tus acciones en impacto real dentro de tu comunidad."
      />

      <section className="text-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHero
            eyebrow="Qua podas hacer con EcoRG"
            title="Una plataforma ambiental pensada para actuar, participar y transformar habitos"
            description="EcoRG reune en un solo lugar el mapa de puntos verdes, los reportes comunitarios, el calendario de recoleccian, la educacian ambiental y la gamificacian para impulsar acciones concretas en RÃ­o Gallegos."
          />

          <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 xl:grid-cols-4">
            {featuredSections.map((section) => (
              <div key={section.id} className="w-[82vw] min-w-[280px] max-w-[320px] snap-start md:w-auto md:min-w-0 md:max-w-none">
                <FeatureCard
                  icon={section.icon}
                  title={section.title}
                  description={section.description}
                  link={section.link}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfdf8] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <SectionHero
            eyebrow="Impacto de la comunidad"
            title="Cada accian registrada ayuda a construir una ciudad más ordenada y consciente"
            description="Estas matricas muestran camo EcoRG puede visibilizar participacian ciudadana, acceso al reciclaje y seguimiento ambiental en un mismo sistema."
          />

          <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
            {impactCards.map((card) => (
              <div key={card.label} className="w-[82vw] min-w-[280px] max-w-[320px] snap-start md:w-auto md:min-w-0 md:max-w-none">
                <ImpactCard {...card} loading={loadingImpact} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-[#d5e6c1] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
              Camo funciona
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#203014] sm:text-4xl">
              Un recorrido simple para usar EcoRG en tu dí­a a dí­a
            </h2>
          </div>

          <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
            {howItWorks.map((item) => (
              <article
                key={item.step}
                className="w-[82vw] min-w-[280px] max-w-[320px] snap-start rounded-[28px] border border-[#dce8ce] bg-white p-6 shadow-[0_16px_40px_rgba(59,89,34,0.08)] md:w-auto md:min-w-0 md:max-w-none md:p-7"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#66a939] text-sm font-semibold text-white">
                  {item.step}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-[#29401a]">
                  {item.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5faee] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <SectionHero
            eyebrow="Gamificacian"
            title="Convertí­ tus acciones en impacto real"
            description="EcoRG reconoce aportes reales a la ciudad: cuando un reporte o una accian validada suma valor, tambian suma puntos, progreso y logros dentro de tu perfil."
            actions={(
              <Link
                to="/gamificacion"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[#66a939] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732] lg:w-auto"
              >
                Ver mi progreso
              </Link>
            )}
          >
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <span
                  key={level}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#4f7a2f] ring-1 ring-[#d5e6c1]"
                >
                  {level}
                </span>
              ))}
            </div>
          </SectionHero>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
            <div className="rounded-[30px] border border-[#dce8ce] bg-white p-6 shadow-[0_16px_40px_rgba(59,89,34,0.08)]">
              <h3 className="text-2xl font-semibold text-[#203014]">Camo ganar puntos</h3>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <article className="rounded-[24px] border border-[#e2ecd4] bg-[#fbfdf8] p-5">
                  <FiCheckCircle className="h-6 w-6 text-[#66a939]" />
                  <h4 className="mt-4 text-lg font-semibold text-[#29401a]">Reportes aprobados</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Cuando un administrador valida un reporte, tu participacian queda reconocida dentro del sistema.
                  </p>
                </article>
                <article className="rounded-[24px] border border-[#e2ecd4] bg-[#fbfdf8] p-5">
                  <FiAward className="h-6 w-6 text-[#66a939]" />
                  <h4 className="mt-4 text-lg font-semibold text-[#29401a]">Logros y niveles</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Tu progreso crece con acciones reales, sostenidas y verificadas, no con interaccian vaci­a.
                  </p>
                </article>
              </div>
            </div>

            <div className="rounded-[30px] border border-[#dce8ce] bg-white p-6 shadow-[0_16px_40px_rgba(59,89,34,0.08)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
                  <FiTarget className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                    Motivacian
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-[#203014]">
                    Participar tambian puede ser inspirador
                  </h3>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-600">
                La gamificacian de EcoRG no busca competir por competir, sino visibilizar aportes concretos que mejoran el ambiente urbano y fortalecen la participacian ciudadana.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <SectionHero
            eyebrow="Accion rapida"
            title="Elegí­ tu praxima accian en EcoRG"
            description="Entra directo a las herramientas mas importantes para participar, resolver problemas y aprender a reciclar mejor."
          />

          <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
            <QuickAction
              to="/reportes"
              icon={FiAlertCircle}
              title="Reportar problema"
              description="Informa un mini basural o una situacian ambiental con ubicacian e imagen."
            />
            <QuickAction
              to="/mapa"
              icon={FiMap}
              title="Ver mapa"
              description="Busca puntos verdes cercanos y resolva rapido dande llevar materiales reciclables."
            />
            <QuickAction
              to="/educacion"
              icon={FiBookOpen}
              title="Ir a educacian"
              description="Acceda a contenidos claros para mejorar habitos y entender mejor qua hacer con tus residuos."
            />
          </div>
        </div>
      </section>

      <section className="bg-[#fbfdf8] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <SectionHero
            eyebrow="Comunidad"
            title="Personas que ya estan participando"
            description="Una vista simple del espí­ritu colaborativo de EcoRG. Este ranking es ilustrativo y busca mostrar camo la participacian puede hacerse visible dentro de la comunidad."
          />

          <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
            {rankingPreview.map((user, index) => (
              <article
                key={user.name}
                className="w-[82vw] min-w-[280px] max-w-[320px] snap-start rounded-[28px] border border-[#dce8ce] bg-white p-6 shadow-[0_16px_40px_rgba(59,89,34,0.08)] md:w-auto md:min-w-0 md:max-w-none"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#66a939] text-sm font-semibold text-white">
                    #{index + 1}
                  </span>
                  <span className="rounded-full bg-[#eef6e4] px-3 py-1 text-xs font-semibold text-[#4f7a2f]">
                    {user.badge}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[#29401a]">{user.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Participacian destacada dentro del ecosistema ciudadano de EcoRG.
                </p>
                <p className="mt-5 text-3xl font-semibold tracking-tight text-[#203014]">
                  {formatMetric(user.points)} pts
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[34px] border border-[#d8e7c5] bg-[linear-gradient(135deg,#f7fbf1_0%,#eef7e2_45%,#f9fcf3_100%)] px-6 py-8 text-center shadow-[0_24px_60px_rgba(73,110,33,0.10)] sm:px-10 sm:py-10">
            <span className="inline-flex rounded-full border border-[#cfe1b7] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#4f7a2f]">
              Participa ahora
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#203014] sm:text-4xl">
              Tu aporte puede transformar problemas cotidianos en mejoras visibles para la ciudad
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Sumate a EcoRG para reportar, reciclar, aprender y participar en una red ciudadana que convierte acciones concretas en impacto ambiental real.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/reportes"
                className="inline-flex items-center justify-center rounded-2xl bg-[#66a939] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732]"
              >
                Empezar a participar
              </Link>
              <Link
                to="/gamificacion"
                className="inline-flex items-center justify-center rounded-2xl border border-[#cfe1b7] bg-white px-5 py-3 text-sm font-semibold text-[#4c7d26] transition hover:border-[#66a939] hover:text-[#33561a]"
              >
                Ver gamificacian
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
