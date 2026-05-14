import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiActivity,
  FiAward,
  FiBookOpen,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiGift,
  FiLock,
  FiMapPin,
  FiShoppingBag,
  FiStar,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { EcoActionsAPI, UsersAPI, getFriendlyApiError } from "../api/api";
import LoadingState from "../components/ui/LoadingState";
import AnimatedNumber from "../components/ui/AnimatedNumber";
import { Reveal, StaggerGroup } from "../components/ui/Reveal";
import { buttonMotion, cardGlowMotion, hoverLift } from "../components/ui/motion";
import SectionHero from "../components/ui/SectionHero";
import { useAuth } from "../state/auth";
import { notifyError, notifySuccess } from "../utils/feedback";

const MotionArticle = motion.article;
const MotionButton = motion.button;

const LEVELS = [
  { label: "Eco principiante", min: 0, max: 99 },
  { label: "Vecino consciente", min: 100, max: 299 },
  { label: "Reciclador activo", min: 300, max: 599 },
  { label: "Guardián ambiental", min: 600, max: 999 },
  { label: "Eco héroe", min: 1000, max: Infinity },
];

const EXPLAINER_CARDS = [
  {
    title: "Reportes aprobados",
    description: "Cuando un reporte es validado por el equipo, suma puntos al perfil del usuario.",
    points: "+20 puntos",
    icon: FiCheckCircle,
  },
  {
    title: "Reciclaje validado",
    description: "Las acciones de reciclaje confirmadas por administración también cuentan dentro del sistema.",
    points: "+15 puntos",
    icon: FiActivity,
  },
  {
    title: "Educación ambiental",
    description: "Las actividades educativas pueden integrarse al progreso del usuario en futuras iteraciones.",
    points: "+5 puntos",
    icon: FiBookOpen,
  },
];

const BADGE_CATALOG = [
  {
    key: "primer_reporte",
    name: "Primer reporte aprobado",
    description: "Obtené la validación de tu primer reporte ambiental dentro de EcoRG.",
    icon: "📣",
  },
  {
    key: "cinco_reportes",
    name: "Vecino comprometido",
    description: "Alcanzá cinco reportes aprobados y consolidá tu participación ciudadana.",
    icon: "🌿",
  },
  {
    key: "primer_reciclaje",
    name: "Primera acción de reciclaje",
    description: "Registrá una acción de reciclaje validada por el equipo.",
    icon: "♻️",
  },
  {
    key: "cien_puntos",
    name: "100 puntos verdes",
    description: "Superá los 100 puntos acumulando acciones ambientales reales.",
    icon: "💯",
  },
  {
    key: "eco_heroe",
    name: "Eco héroe",
    description: "Llegá al nivel más alto disponible en esta versión de EcoRG.",
    icon: "🏅",
  },
];

const TABS = [
  { key: "resumen", label: "Resumen" },
  { key: "beneficios", label: "Beneficios" },
  { key: "logros", label: "Logros" },
  { key: "historial", label: "Historial" },
  { key: "como", label: "Cómo sumar puntos" },
];

const CATEGORY_ICONS = {
  "Gastronomía local": FiShoppingBag,
  "Educación y cultura": FiBookOpen,
  Bienestar: FiAward,
  "Consumo responsable": FiShoppingBag,
  Ambiente: FiMapPin,
  "Movilidad sostenible": FiActivity,
};

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getActionTypeLabel(type) {
  const labels = {
    reporte: "Reporte ambiental",
    reciclaje: "Reciclaje validado",
    educacion: "Acción educativa",
    punto_sugerido: "Sugerencia de punto verde",
  };

  return labels[type] || "Acción ambiental";
}

function getStatusMeta(status) {
  const map = {
    pendiente: {
      label: "Pendiente",
      className: "bg-amber-100 text-amber-700",
      icon: FiClock,
    },
    aprobada: {
      label: "Aprobada",
      className: "bg-emerald-100 text-emerald-700",
      icon: FiCheckCircle,
    },
    rechazada: {
      label: "Rechazada",
      className: "bg-rose-100 text-rose-700",
      icon: FiStar,
    },
  };

  return map[status] || {
    label: "Sin estado",
    className: "bg-slate-100 text-slate-700",
    icon: FiClock,
  };
}

function getCurrentLevel(points = 0) {
  return LEVELS.find((level) => points >= level.min && points <= level.max) || LEVELS[0];
}

function getNextLevel(points = 0) {
  return LEVELS.find((level) => level.min > points) || null;
}

function getProgress(points = 0) {
  const currentLevel = getCurrentLevel(points);
  const nextLevel = getNextLevel(points);

  if (!nextLevel || currentLevel.max === Infinity) {
    return {
      percent: 100,
      currentLevel,
      nextLevel: null,
      remaining: 0,
    };
  }

  const span = currentLevel.max - currentLevel.min + 1;
  const done = Math.max(0, points - currentLevel.min);
  const percent = Math.max(8, Math.min(100, Math.round((done / span) * 100)));

  return {
    percent,
    currentLevel,
    nextLevel,
    remaining: Math.max(0, nextLevel.min - points),
  };
}

function MiniStat({ label, value, helper }) {
  const shouldReduceMotion = useReducedMotion();
  const numericValue = typeof value === "number" ? value : Number.NaN;

  return (
    <MotionArticle
      {...(shouldReduceMotion ? {} : cardGlowMotion)}
      className="rounded-2xl border border-[#deead4] bg-[#fbfdf8] px-4 py-4"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4f7a2f]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#203014]">
        {Number.isFinite(numericValue) ? (
          <AnimatedNumber value={numericValue} />
        ) : (
          value
        )}
      </p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{helper}</p>
    </MotionArticle>
  );
}

function BadgeCard({ badge, earned }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionArticle
      {...(shouldReduceMotion ? {} : hoverLift)}
      className={`rounded-[24px] border p-4 transition ${
        earned
          ? "border-[#dce8ce] bg-white shadow-sm"
          : "border-dashed border-[#d8e3ca] bg-[#fbfdf8]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
            earned ? "bg-[#eef6e4]" : "bg-slate-100"
          }`}
        >
          {earned ? badge.icon : <FiLock className="h-5 w-5 text-slate-400" />}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-[#203014]">{badge.name}</h3>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                earned ? "bg-[#eef6e4] text-[#4f7a2f]" : "bg-slate-100 text-slate-500"
              }`}
            >
              {earned ? "Obtenido" : "Bloqueado"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{badge.description}</p>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
            {earned?.earnedAt ? `Obtenido el ${formatDate(earned.earnedAt)}` : "Todavía no alcanzado"}
          </p>
        </div>
      </div>
    </MotionArticle>
  );
}

function TabButton({ active, children, onClick, id, panelId }) {
  return (
    <MotionButton
      {...buttonMotion}
      type="button"
      id={id}
      role="tab"
      aria-selected={active}
      aria-controls={panelId}
      onClick={onClick}
      className={`whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-[#66a939] text-white shadow-[0_10px_24px_rgba(102,169,57,0.22)]"
          : "bg-white text-slate-600 ring-1 ring-[#d8e7c5] hover:bg-[#f7fbf1] hover:text-[#4f7a2f]"
      }`}
    >
      {children}
    </MotionButton>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-[28px] border border-dashed border-[#d7e5c5] bg-[#fbfdf8] px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
        <FiActivity className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-[#203014]">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function RewardCard({ reward, redeeming, onRedeem }) {
  const shouldReduceMotion = useReducedMotion();
  const Icon = CATEGORY_ICONS[reward.category] || FiGift;

  return (
    <MotionArticle
      {...(shouldReduceMotion ? {} : cardGlowMotion)}
      className={`rounded-[24px] border p-5 ${
        reward.unlocked ? "border-[#dce8ce] bg-white" : "border-[#e3ecd8] bg-[#fbfdf8]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            reward.unlocked ? "bg-[#eef6e4] text-[#4f7a2f]" : "bg-slate-100 text-slate-500"
          }`}
        >
          {reward.pointsRequired} pts
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4f7a2f]">
          {reward.partner}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-[#203014]">{reward.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{reward.description}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#f5faee] px-2.5 py-1 text-xs font-semibold text-[#4f7a2f]">
          {reward.benefitLabel}
        </span>
        <span className="rounded-full bg-[#f3f6ef] px-2.5 py-1 text-xs font-semibold text-slate-600">
          {reward.category}
        </span>
        <span className="rounded-full bg-[#f8faf5] px-2.5 py-1 text-xs font-semibold text-slate-500">
          {reward.impactLabel}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          <span>Progreso hacia el beneficio</span>
          <span>{reward.progressPercent}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf5e1]">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,#66a939_0%,#8fc46a_100%)]"
            initial={shouldReduceMotion ? false : { width: 0 }}
            whileInView={shouldReduceMotion ? undefined : { width: `${reward.progressPercent}%` }}
            viewport={{ once: true, amount: 0.5 }}
            transition={shouldReduceMotion ? undefined : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: `${reward.progressPercent}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-slate-600">
          {reward.unlocked
            ? "Ya podés canjear este beneficio con tus EcoPoints disponibles."
            : `Te faltan ${reward.remainingPoints} puntos para habilitar este beneficio.`}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
          Beneficio ciudadano
        </div>
        <MotionButton
          {...buttonMotion}
          type="button"
          disabled={!reward.unlocked || redeeming}
          onClick={() => onRedeem(reward)}
          className={`inline-flex min-h-[42px] items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            reward.unlocked
              ? "bg-[#66a939] text-white hover:bg-[#5a9732]"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {redeeming ? <FiClock className="h-4 w-4 animate-spin" /> : <FiGift className="h-4 w-4" />}
          {redeeming ? "Emitiendo..." : reward.unlocked ? "Canjear" : "Bloqueado"}
        </MotionButton>
      </div>
    </MotionArticle>
  );
}

export default function Gamification() {
  const { user, ready, login } = useAuth();
  const shouldReduceMotion = useReducedMotion();
  const [profile, setProfile] = useState(null);
  const [actions, setActions] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redeemingId, setRedeemingId] = useState("");
  const [activeTab, setActiveTab] = useState("resumen");

  useEffect(() => {
    if (!ready || !user) {
      setProfile(user || null);
      setActions([]);
      setRewards([]);
      setLoading(false);
      setError("");
      return;
    }

    let cancelled = false;

    async function loadGamification() {
      try {
        setLoading(true);
        setError("");

        const [freshUser, ecoActions, rewardsData] = await Promise.all([
          UsersAPI.getMe(),
          EcoActionsAPI.listMine(),
          UsersAPI.getRewardsCatalog(),
        ]);

        if (cancelled) return;

        setProfile(freshUser || user);
        setActions(Array.isArray(ecoActions) ? ecoActions : []);
        setRewards(Array.isArray(rewardsData?.items) ? rewardsData.items : []);
      } catch (loadError) {
        if (cancelled) return;

        const message = getFriendlyApiError(
          loadError,
          "No pudimos cargar tu progreso ambiental en este momento."
        );
        setProfile(user);
        setActions([]);
        setRewards([]);
        setError(message);
        notifyError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadGamification();

    return () => {
      cancelled = true;
    };
  }, [ready, user]);

  const safeProfile = profile || user || null;
  const points = Number(safeProfile?.points || 0);
  const level = safeProfile?.level || "Eco principiante";
  const progress = useMemo(() => getProgress(points), [points]);
  const earnedBadges = useMemo(
    () => (Array.isArray(safeProfile?.badges) ? safeProfile.badges : []),
    [safeProfile?.badges]
  );
  const badgeMap = useMemo(
    () => new Map(earnedBadges.map((badge) => [badge.key, badge])),
    [earnedBadges]
  );
  const featuredBadges = useMemo(() => BADGE_CATALOG.slice(0, 3), []);
  const rewardSummary = safeProfile?.rewardSummary || {
    totalPoints: points,
    spentPoints: 0,
    availablePoints: points,
    unlockedCount: 0,
    redeemedCount: 0,
    nextReward: null,
  };
  const recentRedemptions = useMemo(
    () => (Array.isArray(safeProfile?.rewardRedemptions) ? safeProfile.rewardRedemptions.slice(0, 3) : []),
    [safeProfile?.rewardRedemptions]
  );

  async function handleRedeemReward(reward) {
    try {
      setRedeemingId(reward.id);
      const result = await UsersAPI.redeemReward(reward.id);
      if (result?.user) {
        setProfile(result.user);
        login(result.user);
      }
      if (Array.isArray(rewards)) {
        const nextCatalog = await UsersAPI.getRewardsCatalog();
        setRewards(Array.isArray(nextCatalog?.items) ? nextCatalog.items : []);
      }
      notifySuccess(result?.message || "Beneficio emitido correctamente.");
    } catch (redeemError) {
      notifyError(
        getFriendlyApiError(
          redeemError,
          "No pudimos emitir este beneficio en este momento."
        )
      );
    } finally {
      setRedeemingId("");
    }
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <LoadingState
          title="Validando sesión"
          description="Estamos preparando tu panel de gamificación."
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHero
          eyebrow="Gamificación"
          title="Sumá puntos participando en acciones ambientales"
          description="Iniciá sesión para ver tus puntos, tu nivel actual y el historial de acciones validadas dentro de EcoRG."
          actions={(
            <Link
              to="/login?next=/gamificacion"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[#66a939] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732] lg:w-auto"
            >
              Acceder
            </Link>
          )}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8">
      <SectionHero
        eyebrow="Gamificación"
        title="Sumá puntos participando en acciones ambientales"
        description="Entendé rápido tu progreso, tus logros y las acciones que te ayudan a avanzar dentro de EcoRG."
      >
        <div className="grid min-w-0 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            {...(shouldReduceMotion ? {} : cardGlowMotion)}
            className="min-w-0 rounded-[28px] border border-[#dce8ce] bg-white p-5 shadow-[0_16px_40px_rgba(59,89,34,0.08)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">Tu progreso</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#203014]">
                  <AnimatedNumber value={points} /> pts
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Nivel actual: <span className="font-semibold text-[#35561a]">{level}</span>
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  EcoPoints disponibles para beneficios:{" "}
                  <span className="font-semibold text-[#35561a]">{rewardSummary.availablePoints}</span>
                </p>
              </div>
              <div className="min-w-0 break-words rounded-2xl bg-[#f5faee] px-4 py-3 text-sm text-slate-600">
                {progress.nextLevel
                  ? `Te faltan ${progress.remaining} puntos para ${progress.nextLevel.label}.`
                  : "Ya alcanzaste el nivel más alto disponible."}
              </div>
            </div>

            <div className="mt-5">
              <div className="h-4 overflow-hidden rounded-full bg-[#edf5e1]">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#66a939_0%,#85c457_100%)] transition-all"
                  initial={shouldReduceMotion ? false : { width: 0 }}
                  whileInView={shouldReduceMotion ? undefined : { width: `${progress.percent}%` }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                <span>{progress.currentLevel.min} pts</span>
                <span>{points} pts</span>
                <span>{progress.nextLevel ? progress.nextLevel.min : "1000+ pts"}</span>
              </div>
            </div>
          </motion.div>

          <StaggerGroup className="flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:pb-0 xl:grid-cols-2">
            <MiniStat
              label="Usuario"
              value={safeProfile?.nombre || "Cuenta EcoRG"}
              helper="Tu progreso está asociado a tu cuenta actual."
            />
            <MiniStat
              label="Acciones"
              value={actions.length.toLocaleString("es-AR")}
              helper="Pendientes, aprobadas y rechazadas."
            />
            <MiniStat
              label="Logros"
              value={earnedBadges.length.toLocaleString("es-AR")}
              helper="Insignias obtenidas automáticamente."
            />
            <MiniStat
              label="Beneficios"
              value={rewardSummary.unlockedCount}
              helper="Canjes disponibles hoy con tus EcoPoints."
            />
          </StaggerGroup>
        </div>
      </SectionHero>

      <Reveal className="mt-8 min-w-0 rounded-[30px] border border-[#dce8ce] bg-white p-4 shadow-[0_16px_40px_rgba(59,89,34,0.08)] sm:p-6">
        <div className="flex min-w-0 gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Secciones de gamificación">
          {TABS.map((tab) => (
            <TabButton
              key={tab.key}
              active={activeTab === tab.key}
              id={`gamification-tab-${tab.key}`}
              panelId={`gamification-panel-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </TabButton>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === "resumen" && (
            <div id="gamification-panel-resumen" role="tabpanel" aria-labelledby="gamification-tab-resumen" className="grid min-w-0 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="min-w-0 rounded-[28px] border border-[#dce8ce] bg-[#fbfdf8] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                  Niveles disponibles
                </p>
                <div className="mt-5 flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0">
                  {LEVELS.map((item) => (
                    <article
                      key={item.label}
                      className={`w-[82vw] min-w-[260px] max-w-[320px] snap-start rounded-2xl border px-4 py-3 text-sm sm:w-auto sm:min-w-0 sm:max-w-none ${
                        item.label === level
                          ? "border-[#66a939] bg-[#f4f9ee] text-[#35561a]"
                          : "border-[#e2ecd4] bg-white text-slate-600"
                      }`}
                    >
                      <p className="font-semibold">{item.label}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.12em]">
                        {item.max === Infinity ? `${item.min}+ puntos` : `${item.min} - ${item.max} puntos`}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="min-w-0 rounded-[28px] border border-[#dce8ce] bg-[#fbfdf8] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                      Logros destacados
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-[#203014]">
                      Tus insignias visibles
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("logros")}
                    className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[#4f7a2f] ring-1 ring-[#d8e7c5] transition hover:bg-[#f7fbf1]"
                  >
                    Ver todos
                  </button>
                </div>

                <div className="mt-5 flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid sm:overflow-visible sm:pb-0">
                  {featuredBadges.map((badge) => (
                    <div key={badge.key} className="w-[82vw] min-w-[280px] max-w-[320px] snap-start sm:w-auto sm:min-w-0 sm:max-w-none">
                      <BadgeCard badge={badge} earned={badgeMap.get(badge.key)} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-w-0 rounded-[28px] border border-[#dce8ce] bg-[#fbfdf8] p-5 xl:col-span-2">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                      Beneficios ciudadanos
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-[#203014]">
                      Tu impacto positivo también abre oportunidades reales
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("beneficios")}
                    className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[#4f7a2f] ring-1 ring-[#d8e7c5] transition hover:bg-[#f7fbf1]"
                  >
                    Ver beneficios
                  </button>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <MiniStat
                    label="Disponibles"
                    value={rewardSummary.unlockedCount}
                    helper="Beneficios que ya podés emitir."
                  />
                  <MiniStat
                    label="Canjes"
                    value={rewardSummary.redeemedCount}
                    helper="Historial de beneficios emitidos."
                  />
                  <MiniStat
                    label="Saldo actual"
                    value={rewardSummary.availablePoints}
                    helper="EcoPoints listos para usar."
                  />
                </div>

                {rewardSummary.nextReward ? (
                  <div className="mt-5 rounded-2xl border border-[#dce8ce] bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4f7a2f]">
                      Próximo beneficio recomendado
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[#203014]">
                      {rewardSummary.nextReward.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {rewardSummary.nextReward.partner} · Te faltan {rewardSummary.nextReward.remainingPoints} puntos.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {activeTab === "beneficios" && (
            <div id="gamification-panel-beneficios" role="tabpanel" aria-labelledby="gamification-tab-beneficios">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                    Comercios adheridos
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#203014]">
                    Beneficios con impacto local
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    Tus EcoPoints no se convierten en compras impulsivas: se transforman en incentivos ciudadanos para fortalecer hábitos sustentables, consumo local responsable y participación comunitaria.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f5faee] px-4 py-3 text-sm text-slate-600">
                  <span className="font-semibold text-[#35561a]">{rewardSummary.availablePoints} puntos disponibles</span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {rewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    redeeming={redeemingId === reward.id}
                    onRedeem={handleRedeemReward}
                  />
                ))}
              </div>

              {recentRedemptions.length ? (
                <div className="mt-8 rounded-[28px] border border-[#dce8ce] bg-[#fbfdf8] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                    Historial reciente de beneficios
                  </p>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {recentRedemptions.map((reward) => (
                      <article key={`${reward.rewardId}-${reward.code}`} className="rounded-2xl border border-[#dce8ce] bg-white p-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-[#eef6e4] px-2.5 py-1 text-xs font-semibold text-[#4f7a2f]">
                            {reward.pointsSpent} pts
                          </span>
                          <span className="rounded-full bg-[#f6f8f2] px-2.5 py-1 text-xs font-semibold text-slate-500">
                            {reward.status}
                          </span>
                        </div>
                        <h3 className="mt-3 text-base font-semibold text-[#203014]">{reward.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">{reward.partner}</p>
                        <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#4f7a2f]">
                          <FiCheck className="h-4 w-4" />
                          Código {reward.code}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {activeTab === "logros" && (
            <div id="gamification-panel-logros" role="tabpanel" aria-labelledby="gamification-tab-logros">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                    Mis logros
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#203014]">
                    Insignias ambientales
                  </h2>
                </div>
                <span className="rounded-full bg-[#eef6e4] px-3 py-1 text-xs font-semibold text-[#4f7a2f]">
                  {earnedBadges.length} de {BADGE_CATALOG.length} obtenidos
                </span>
              </div>

              <div className="flex min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:pb-0 xl:grid-cols-3">
                {BADGE_CATALOG.map((badge) => (
                  <div key={badge.key} className="w-[82vw] min-w-[280px] max-w-[320px] snap-start md:w-auto md:min-w-0 md:max-w-none">
                    <BadgeCard badge={badge} earned={badgeMap.get(badge.key)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "historial" && (
            <div id="gamification-panel-historial" role="tabpanel" aria-labelledby="gamification-tab-historial">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                    Historial de acciones
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#203014]">
                    Tu actividad registrada
                  </h2>
                </div>
              </div>

              <div className="mt-6">
                {loading ? (
                  <LoadingState
                    compact
                    title="Cargando historial"
                    description="Estamos buscando tus acciones ambientales registradas."
                  />
                ) : error ? (
                  <div className="rounded-[28px] border border-[#f0d7dc] bg-[#fff8f8] px-6 py-12 text-center">
                    <h3 className="text-xl font-semibold text-[#203014]">No pudimos cargar la gamificación</h3>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
                      {error}
                    </p>
                  </div>
                ) : actions.length === 0 ? (
                  <EmptyState
                    title="Todavía no hay acciones registradas"
                    description="Cuando una acción ambiental sea registrada o validada, va a aparecer acá con su estado y puntaje."
                  />
                ) : (
                  <div className="space-y-4">
                    {actions.map((action) => {
                      const status = getStatusMeta(action.status);
                      const StatusIcon = status.icon;

                      return (
                        <article
                          key={action._id}
                          className="rounded-[24px] border border-[#e2ecd4] bg-[#fbfdf8] px-5 py-4"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-semibold text-[#203014]">
                                  {getActionTypeLabel(action.type)}
                                </h3>
                                <span className="rounded-full bg-[#eef6e4] px-2.5 py-1 text-xs font-semibold text-[#4f7a2f]">
                                  +{Number(action.points || 0)} pts
                                </span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {action.description || "Sin descripción adicional."}
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                                <span>{formatDate(action.createdAt)}</span>
                                {action.relatedId ? <span>Relacionado a un registro del sistema</span> : null}
                              </div>
                            </div>

                            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${status.className}`}>
                              <StatusIcon className="h-4 w-4" />
                              {status.label}
                            </span>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "como" && (
            <div id="gamification-panel-como" role="tabpanel" aria-labelledby="gamification-tab-como">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                    Cómo sumar puntos
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#203014]">
                    Acciones que hacen crecer tu progreso
                  </h2>
                </div>
              </div>

              <div className="flex min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:pb-0 xl:grid-cols-3">
                {EXPLAINER_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <article
                      key={card.title}
                      className="w-[82vw] min-w-[280px] max-w-[320px] snap-start rounded-[24px] border border-[#dce8ce] bg-[#fbfdf8] p-5 md:w-auto md:min-w-0 md:max-w-none"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-[#203014]">{card.title}</h3>
                        <span className="rounded-full bg-[#f5faee] px-2.5 py-1 text-xs font-semibold text-[#4f7a2f]">
                          {card.points}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}

