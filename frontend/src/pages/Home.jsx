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
      "Encontrá lugares de reciclaje en Río Gallegos y filtrá por material para resolver rápido dónde llevar tus residuos.",
    icon: FiMap,
    link: "/mapa",
  },
  {
    id: "reportes",
    title: "Reportes comunitarios",
    description:
      "Informá mini basurales o problemas ambientales con una ubicación clara para colaborar con una ciudad más limpia.",
    icon: FiAlertCircle,
    link: "/reportes",
  },
  {
    id: "calendario",
    title: "Calendario de recolección",
    description:
      "Consultá días y horarios de recolección diferenciada por barrio para organizar mejor tus residuos.",
    icon: FiCalendar,
    link: "/calendario",
  },
  {
    id: "educacion",
    title: "Educación ambiental",
    description:
      "Accedé a guías breves y consejos prácticos para reciclar mejor y sumar hábitos más sustentables.",
    icon: FiBookOpen,
    link: "/educacion",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Buscá puntos verdes cercanos",
    description:
      "Usá el mapa para ubicar lugares de reciclaje según el tipo de material que quieras separar.",
  },
  {
    step: "02",
    title: "Reportá problemas ambientales",
    description:
      "Si detectás un mini basural o una situación ambiental, registrala para que pueda visualizarse y gestionarse mejor.",
  },
  {
    step: "03",
    title: "Aprendé y participá en tu ciudad",
    description:
      "Consultá contenidos educativos y horarios de recolección para transformar la información en acciones concretas.",
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
        title="EcoRG: acciones cotidianas para una Río Gallegos más limpia y participativa"
        subtitle="Encontrá puntos verdes, reportá problemas ambientales, aprendé sobre reciclaje y convertí tus acciones en impacto real dentro de tu comunidad."
      />

      <section className="text-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHero
            eyebrow="Qué podés hacer con EcoRG"
            title="Una plataforma ambiental pensada para actuar, participar y transformar hábitos"
            description="EcoRG reúne en un solo lugar el mapa de puntos verdes, los reportes comunitarios, el calendario de recolección, la educación ambiental y la gamificación para impulsar acciones concretas en Río Gallegos."
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
            title="Cada acción registrada ayuda a construir una ciudad más ordenada y consciente"
            description="Estas métricas muestran cómo EcoRG puede visibilizar participación ciudadana, acceso al reciclaje y seguimiento ambiental en un mismo sistema."
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
              Cómo funciona
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#203014] sm:text-4xl">
              Un recorrido simple para usar EcoRG en tu día a día
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
            eyebrow="Gamificación"
            title="Convertí tus acciones en impacto real"
            description="EcoRG reconoce aportes reales a la ciudad: cuando un reporte o una acción validada suma valor, también suma puntos, progreso y logros dentro de tu perfil."
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
              <h3 className="text-2xl font-semibold text-[#203014]">Cómo ganar puntos</h3>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <article className="rounded-[24px] border border-[#e2ecd4] bg-[#fbfdf8] p-5">
                  <FiCheckCircle className="h-6 w-6 text-[#66a939]" />
                  <h4 className="mt-4 text-lg font-semibold text-[#29401a]">Reportes aprobados</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Cuando un administrador valida un reporte, tu participación queda reconocida dentro del sistema.
                  </p>
                </article>
                <article className="rounded-[24px] border border-[#e2ecd4] bg-[#fbfdf8] p-5">
                  <FiAward className="h-6 w-6 text-[#66a939]" />
                  <h4 className="mt-4 text-lg font-semibold text-[#29401a]">Logros y niveles</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Tu progreso crece con acciones reales, sostenidas y verificadas, no con interacción vacía.
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
                    Motivación
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-[#203014]">
                    Participar también puede ser inspirador
                  </h3>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-600">
                La gamificación de EcoRG no busca competir por competir, sino visibilizar aportes concretos que mejoran el ambiente urbano y fortalecen la participación ciudadana.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <SectionHero
            eyebrow="Acción rápida"
            title="Elegí tu próxima acción en EcoRG"
            description="Entrá directo a las herramientas más importantes para participar, resolver problemas y aprender a reciclar mejor."
          />

          <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
            <QuickAction
              to="/reportes"
              icon={FiAlertCircle}
              title="Reportar problema"
              description="Informá un mini basural o una situación ambiental con ubicación e imagen."
            />
            <QuickAction
              to="/mapa"
              icon={FiMap}
              title="Ver mapa"
              description="Buscá puntos verdes cercanos y resolvé rápido dónde llevar materiales reciclables."
            />
            <QuickAction
              to="/educacion"
              icon={FiBookOpen}
              title="Ir a educación"
              description="Accedé a contenidos claros para mejorar hábitos y entender mejor qué hacer con tus residuos."
            />
          </div>
        </div>
      </section>

      <section className="bg-[#fbfdf8] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <SectionHero
            eyebrow="Comunidad"
            title="Personas que ya están participando"
            description="Una vista simple del espíritu colaborativo de EcoRG. Este ranking es ilustrativo y busca mostrar cómo la participación puede hacerse visible dentro de la comunidad."
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
                  Participación destacada dentro del ecosistema ciudadano de EcoRG.
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
              Participá ahora
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
                Ver gamificación
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
