import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AuthAPI,
  clearRememberedEmail,
  getFriendlyApiError,
  getRememberedEmail,
} from "../../api/api";
import { useAuth } from "../../state/auth";
import { notifyError, notifySuccess } from "../../utils/feedback";
import Modal from "../ui/Modal";
import { buttonMotion, fadeUpVariants, subtleStagger } from "../ui/motion";

const MotionDiv = motion.div;
const MotionButton = motion.button;

const loginSchema = z.object({
  email: z.string().min(1, "El email es obligatorio").email("Formato de email invalido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

const forgotSchema = z.object({
  email: z.string().min(1, "El email es obligatorio").email("IngresÃ¡ un email valido"),
});

export default function LoginForm() {
  const shouldReduceMotion = useReducedMotion();
  const canShowResetLink =
    import.meta.env.DEV && import.meta.env.VITE_SHOW_RESET_LINK === "true";
  const rememberedEmail = useMemo(() => getRememberedEmail(), []);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/";
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedEmail));
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [devResetUrl, setDevResetUrl] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: rememberedEmail,
      password: "",
    },
  });

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    reset: resetForgot,
    formState: { errors: forgotErrors, isSubmitting: isSendingReset },
  } = useForm({
    resolver: zodResolver(forgotSchema),
    mode: "onSubmit",
    defaultValues: { email: rememberedEmail },
  });

  const onSubmit = async (data) => {
    setServerError("");

    try {
      const { user } = await AuthAPI.login(data.email, data.password, { remember: rememberMe });
      notifySuccess("Inicio de sesiÃ³n exitoso");
      login(user);
      navigate(next, { replace: true });
    } catch (err) {
      const apiError = err?.response?.data?.error;
      let friendly = getFriendlyApiError(err, "No pudimos iniciar sesiÃ³n. VerificÃ¡ tus datos.");

      if (apiError === "USER_NOT_FOUND") {
        friendly = "El usuario no estÃ¡ registrado. NecesitÃ¡s crear tu cuenta.";
      } else if (apiError === "WRONG_PASSWORD") {
        friendly = "La contraseÃ±a es incorrecta. ProbÃ¡ nuevamente.";
      } else if (apiError === "MISSING_FIELDS") {
        friendly = "CompletÃ¡ email y contraseÃ±a.";
      }

      if (import.meta.env.DEV) {
        console.error("LOGIN_FORM_ERROR", err);
      }

      setServerError(friendly);
      notifyError(friendly);
    }
  };

  const onForgotSubmit = async ({ email }) => {
    setForgotSuccess("");
    setDevResetUrl("");

    try {
      const response = await AuthAPI.forgotPassword(email);
      const successMessage =
        response?.message || "Si el correo existe, recibirÃ¡s instrucciones para restablecer tu contraseÃ±a.";

      setForgotSuccess(successMessage);
      setDevResetUrl(canShowResetLink ? response?.resetUrl || "" : "");
      notifySuccess(successMessage);
      resetForgot({ email });
    } catch (err) {
      const friendly = getFriendlyApiError(
        err,
        "No pudimos procesar la solicitud de recuperaciÃ³n. IntentÃ¡ nuevamente."
      );
      notifyError(friendly);
    }
  };

  const [show, setShow] = useState(false);

  return (
    <>
      <MotionDiv
        initial={shouldReduceMotion ? false : "hidden"}
        animate={shouldReduceMotion ? undefined : "visible"}
        variants={shouldReduceMotion ? undefined : subtleStagger}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <MotionDiv variants={shouldReduceMotion ? undefined : fadeUpVariants} className="text-left">
            <h2 className="text-2xl font-semibold text-[#203014]">Bienvenido/a</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Ingresá tus credenciales para continuar usando EcoRG.
            </p>
          </MotionDiv>

          {serverError ? (
            <MotionDiv
              variants={shouldReduceMotion ? undefined : fadeUpVariants}
              className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {serverError}
            </MotionDiv>
          ) : null}

          <MotionDiv variants={shouldReduceMotion ? undefined : fadeUpVariants}>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#2d3d33]">Email</span>
              <input type="email" className="input-base" placeholder="tu@correo.com" {...register("email")} />
              {errors.email ? (
                <p role="alert" className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              ) : null}
            </label>
          </MotionDiv>

          <MotionDiv variants={shouldReduceMotion ? undefined : fadeUpVariants}>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#2d3d33]">Contraseña</span>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  className="input-base"
                  placeholder="*********"
                  {...register("password")}
                />
                <MotionButton
                  {...(shouldReduceMotion ? {} : buttonMotion)}
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#2d3d33]/60 hover:text-[#2d3d33]"
                  aria-label={show ? "Ocultar contraseÃ±a" : "Mostrar contraseÃ±a"}
                >
                  {show ? eyeOff : eye}
                </MotionButton>
              </div>
              {errors.password ? (
                <p role="alert" className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              ) : null}
            </label>
          </MotionDiv>

          <MotionDiv
            variants={shouldReduceMotion ? undefined : fadeUpVariants}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <label className="inline-flex select-none items-center gap-2 text-[#2d3d33]/80">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setRememberMe(checked);
                  if (!checked) {
                    clearRememberedEmail();
                  }
                }}
                className="h-4 w-4 rounded accent-[#66a939]"
              />
              Recordarme
            </label>
            <button
              type="button"
              onClick={() => {
                setForgotOpen(true);
                setForgotSuccess("");
                setDevResetUrl("");
              }}
              className="font-medium text-[#4f7a2f] hover:underline"
            >
              Olvidé mi contraseña
            </button>
          </MotionDiv>

          <MotionButton
            {...(shouldReduceMotion ? {} : buttonMotion)}
            variants={shouldReduceMotion ? undefined : fadeUpVariants}
            type="submit"
            disabled={isSubmitting}
            className="buttonprimary w-full rounded-2xl px-6 py-3 font-medium shadow disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </MotionButton>
        </form>
      </MotionDiv>

      <Modal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        title="Recuperar contraseña"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm leading-6 text-slate-600">
            Ingresá tu correo y, si existe una cuenta asociada, te enviaremos instrucciones para
            restablecer la contraseña.
          </p>

          {forgotSuccess ? (
            <div className="rounded-2xl border border-[#dce8ce] bg-[#f7fbf3] px-4 py-3 text-sm text-[#35561a]">
              {forgotSuccess}
            </div>
          ) : null}

          {canShowResetLink && devResetUrl ? (
            <MotionDiv
              variants={shouldReduceMotion ? undefined : fadeUpVariants}
              className="rounded-2xl border border-[#d8e7c5] bg-[#fbfdf8] px-4 py-3 text-sm text-slate-700"
            >
              <p className="font-medium text-[#203014]">Link de recuperación para desarrollo</p>
              <a
                href={devResetUrl}
                className="mt-2 block break-all text-[#4f7a2f] hover:underline"
              >
                {devResetUrl}
              </a>
            </MotionDiv>
          ) : null}

          <form onSubmit={handleSubmitForgot(onForgotSubmit)} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#2d3d33]">Email</span>
              <input
                type="email"
                className="input-base"
                placeholder="tu@correo.com"
                {...registerForgot("email")}
              />
              {forgotErrors.email ? (
                <p role="alert" className="mt-1 text-sm text-red-600">{forgotErrors.email.message}</p>
              ) : null}
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <MotionButton
                {...(shouldReduceMotion ? {} : buttonMotion)}
                type="button"
                onClick={() => setForgotOpen(false)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-[#dbe8cc] px-4 py-3 text-sm font-semibold text-[#35561a] transition hover:bg-[#f7fbf1]"
              >
                Cancelar
              </MotionButton>
              <MotionButton
                {...(shouldReduceMotion ? {} : buttonMotion)}
                type="submit"
                disabled={isSendingReset}
                className="inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-[#66a939] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSendingReset ? "Enviando..." : "Enviar instrucciones"}
              </MotionButton>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

const eye = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const eyeOff = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3l18 18M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 3-3 3 3 0 0 0-.6-1.8M9.9 4.2A11.8 11.8 0 0 1 12 4c7 0 11 8 11 8a21 21 0 0 1-5.2 6.4M6.4 6.4A20.7 20.7 0 0 0 1 12s4 8 11 8c1.3 0 2.5-.2 3.6-.6" />
  </svg>
);
