import { motion, useReducedMotion } from "framer-motion";
import { FiAlertCircle, FiArrowRight, FiHome, FiMap, FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router-dom";
import { buttonMotion, fadeUpVariants } from "../components/ui/motion";

const MotionSection = motion.section;
const MotionDiv = motion.div;
const MotionLink = motion(Link);

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-[70vh] bg-[radial-gradient(circle_at_top,rgba(102,169,57,0.10),transparent_42%),linear-gradient(180deg,#fbfdf8_0%,#f4f9ee_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center">
        <MotionSection
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
          variants={fadeUpVariants}
          className="w-full overflow-hidden rounded-[34px] border border-[#d8e7c5] bg-white/90 px-6 py-8 text-center shadow-[0_24px_60px_rgba(73,110,33,0.12)] backdrop-blur-xl sm:px-10 sm:py-10"
        >
          <MotionDiv
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9, y: 10 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.06 }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] bg-[linear-gradient(135deg,#eef6e4_0%,#e3f0d3_100%)] text-[#66a939] shadow-[inset_0_0_0_1px_rgba(102,169,57,0.10)]"
          >
            <FiAlertCircle className="h-11 w-11" aria-hidden="true" />
          </MotionDiv>

          <span className="mt-6 inline-flex rounded-full border border-[#cfe1b7] bg-[#f8fbf4] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#4f7a2f]">
            Error 404
          </span>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#203014] sm:text-4xl">
            Página no encontrada
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            La página que estás buscando no existe o fue movida. Podés volver al inicio
            o seguir explorando las herramientas principales de EcoRG.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <MotionLink
              {...(shouldReduceMotion ? {} : buttonMotion)}
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#66a939] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(76,126,40,0.22)] transition hover:bg-[#578f31]"
            >
              <FiHome className="h-4 w-4" />
              Volver al inicio
            </MotionLink>

            <MotionLink
              {...(shouldReduceMotion ? {} : buttonMotion)}
              to="/mapa"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d7e5c5] bg-white px-5 py-3 text-sm font-semibold text-[#35561a] transition hover:border-[#66a939] hover:bg-[#f7fbf1]"
            >
              <FiMap className="h-4 w-4" />
              Ir al mapa
            </MotionLink>

            <MotionLink
              {...(shouldReduceMotion ? {} : buttonMotion)}
              to="/reportes"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d7e5c5] bg-white px-5 py-3 text-sm font-semibold text-[#35561a] transition hover:border-[#66a939] hover:bg-[#f7fbf1]"
            >
              <FiRefreshCw className="h-4 w-4" />
              Reportar problema
            </MotionLink>
          </div>

          <div className="mt-8 rounded-[28px] border border-[#e4edd8] bg-[#fbfdf8] px-5 py-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
              Sugerencia rápida
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Si llegaste hasta acá desde un enlace viejo o un acceso guardado, podés volver al
              inicio y retomar tu recorrido desde las secciones principales.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#5a9732] transition hover:text-[#3f6922]"
            >
              Seguir explorando EcoRG
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </MotionSection>
      </div>
    </div>
  );
}
