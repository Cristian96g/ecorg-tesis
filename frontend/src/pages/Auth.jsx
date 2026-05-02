import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import Logo from "../assets/ecorg-logo.png";
import {
  buttonMotion,
  cardGlowMotion,
  fadeUpVariants,
  heroContainerVariants,
  heroItemVariants,
} from "../components/ui/motion";

const MotionAside = motion.aside;
const MotionDiv = motion.div;
const MotionButton = motion.button;

export default function AuthPage({ mode = "login" }) {
  const shouldReduceMotion = useReducedMotion();
  const location = useLocation();
  const initial = location.pathname.includes("registr") ? "register" : mode;
  const search = location.search || "";
  const [tab, setTab] = React.useState(initial);

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <MotionAside
        initial={shouldReduceMotion ? false : "hidden"}
        animate={shouldReduceMotion ? undefined : "visible"}
        variants={shouldReduceMotion ? undefined : heroContainerVariants}
        className="relative hidden overflow-hidden bg-[linear-gradient(145deg,#f6faef_0%,#ebf5df_48%,#f8fbf4_100%)] p-12 lg:flex lg:flex-col lg:justify-between"
      >
        <div className="absolute -right-10 -top-16 h-80 w-80 rounded-full bg-[#66a939]/18" />
        <div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-[#66a939]/14" />

        <MotionDiv
          className="relative z-10"
          variants={shouldReduceMotion ? undefined : heroContainerVariants}
        >
          <MotionDiv variants={shouldReduceMotion ? undefined : heroItemVariants}>
            <img src={Logo} alt="EcoRG logo" className="h-20 w-auto" draggable="false" />
          </MotionDiv>
          <MotionDiv variants={shouldReduceMotion ? undefined : heroItemVariants}>
            <span className="mt-8 inline-flex rounded-full border border-[#d5e6c1] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
              Cuenta EcoRG
            </span>
          </MotionDiv>
          <MotionDiv variants={shouldReduceMotion ? undefined : heroItemVariants}>
            <h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight text-[#203014]">
              Accedé a una experiencia ciudadana más útil y participativa
            </h1>
          </MotionDiv>
          <MotionDiv variants={shouldReduceMotion ? undefined : heroItemVariants}>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
              Iniciá sesión o creá tu cuenta
            </p>
          </MotionDiv>
        </MotionDiv>

        <MotionDiv
          className="relative z-10 grid gap-4"
          variants={shouldReduceMotion ? undefined : heroContainerVariants}
        >
          <MotionDiv
            variants={shouldReduceMotion ? undefined : heroItemVariants}
            {...(shouldReduceMotion ? {} : cardGlowMotion)}
            className="rounded-[26px] border border-[#dce8ce] bg-white/90 p-5 shadow-sm"
          >
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#4f7a2f]">
              Que podes hacer
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Crear reportes, consultar el mapa de puntos verdes y mantener tu perfil actualizado.
            </p>
          </MotionDiv>
          <MotionDiv
            variants={shouldReduceMotion ? undefined : heroItemVariants}
            {...(shouldReduceMotion ? {} : cardGlowMotion)}
            className="rounded-[26px] border border-[#dce8ce] bg-white/90 p-5 shadow-sm"
          >
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#4f7a2f]">
              Pensado para la ciudad
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              EcoRG acompaña acciones ambientales concretas con una interfaz simple y accesible.
            </p>
          </MotionDiv>
        </MotionDiv>
      </MotionAside>

      <main className="flex items-center justify-center p-6 sm:p-10">
        <MotionDiv
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
          variants={shouldReduceMotion ? undefined : heroContainerVariants}
          className="w-full max-w-md"
        >
          <MotionDiv
            variants={shouldReduceMotion ? undefined : fadeUpVariants}
            className="rounded-[28px] border border-[#dce8ce] bg-white p-2 shadow-[0_16px_36px_rgba(59,89,34,0.08)]"
          >
            <div className="mb-5 flex rounded-2xl bg-[#f5faee] p-1">
              <MotionButton
                {...(shouldReduceMotion ? {} : buttonMotion)}
                onClick={() => setTab("login")}
                className={`flex-1 rounded-2xl py-3 text-sm font-semibold transition ${
                  tab === "login"
                    ? "bg-[#66a939] text-white shadow-sm"
                    : "text-[#2d3d33] hover:bg-white"
                }`}
              >
                Iniciar sesión
              </MotionButton>
              <MotionButton
                {...(shouldReduceMotion ? {} : buttonMotion)}
                onClick={() => setTab("register")}
                className={`flex-1 rounded-2xl py-3 text-sm font-semibold transition ${
                  tab === "register"
                    ? "bg-[#66a939] text-white shadow-sm"
                    : "text-[#2d3d33] hover:bg-white"
                }`}
              >
                Crear cuenta
              </MotionButton>
            </div>

            <MotionDiv
              variants={shouldReduceMotion ? undefined : fadeUpVariants}
              className="rounded-[24px] border border-[#edf4e4] bg-white p-6 sm:p-7"
            >
              {tab === "login" ? (
                <LoginForm key={`login-${search}`} />
              ) : (
                <RegisterForm key={`register-${search}`} />
              )}
            </MotionDiv>
          </MotionDiv>

          <MotionDiv variants={shouldReduceMotion ? undefined : fadeUpVariants}>
            <p className="mt-6 text-center text-sm text-[#2d3d33]/70">
              {tab === "login" ? (
                <>
                  ¿No tenes cuenta?{" "}
                  <button
                    className="font-semibold text-[#4f7a2f] hover:underline"
                    onClick={() => setTab("register")}
                  >
                    Registrate
                  </button>
                </>
              ) : (
                <>
                  ¿Ya tenes cuenta?{" "}
                  <button
                    className="font-semibold text-[#4f7a2f] hover:underline"
                    onClick={() => setTab("login")}
                  >
                    Inicia sesión
                  </button>
                </>
              )}
            </p>
          </MotionDiv>
        </MotionDiv>
      </main>
    </div>
  );
}
