import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthAPI, getFriendlyApiError } from "../../api/api";
import { useAuth } from "../../state/auth";
import { notifyError, notifySuccess } from "../../utils/feedback";
import { buttonMotion, fadeUpVariants, subtleStagger } from "../ui/motion";

const MotionDiv = motion.div;
const MotionButton = motion.button;

const schema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().min(1, "El email es obligatorio").email("Formato de email invalido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  barrio: z.string().optional(),
});

export default function RegisterForm() {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/";
  const { login } = useAuth();
  const [serverError, setServerError] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), mode: "onSubmit" });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const { user } = await AuthAPI.register(data);
      login(user);
      notifySuccess("Cuenta creada con exito");
      navigate(next, { replace: true });
    } catch (err) {
      const msg = getFriendlyApiError(err, "No pudimos crear tu cuenta. Proba nuevamente.");
      if (import.meta.env.DEV) {
        console.error("REGISTER_FORM_ERROR", err);
      }
      setServerError(msg);
      notifyError(msg);
    }
  };

  const [show, setShow] = React.useState(false);

  return (
    <MotionDiv
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion ? undefined : "visible"}
      variants={shouldReduceMotion ? undefined : subtleStagger}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <MotionDiv variants={shouldReduceMotion ? undefined : fadeUpVariants}>
          <h2 className="text-2xl font-semibold text-[#203014]">Crear cuenta</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Sumate a EcoRG en un minuto y empezá a participar desde tu barrio.
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
            <span className="mb-1 block text-sm font-medium text-[#2d3d33]">Nombre y apellido</span>
            <input className="input-base" placeholder="María Lopez" {...register("nombre")} />
            {errors.nombre ? (
              <p role="alert" className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
            ) : null}
          </label>
        </MotionDiv>

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
                placeholder="Minimo 6 caracteres"
                {...register("password")}
              />
              <MotionButton
                {...(shouldReduceMotion ? {} : buttonMotion)}
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#2d3d33]/60 hover:text-[#2d3d33]"
                aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {show ? eyeOff : eye}
              </MotionButton>
            </div>
            {errors.password ? (
              <p role="alert" className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            ) : null}
          </label>
        </MotionDiv>

        <MotionDiv variants={shouldReduceMotion ? undefined : fadeUpVariants}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#2d3d33]">Telefono (opcional)</span>
            <input className="input-base" placeholder="2966 123456" {...register("telefono")} />
          </label>
        </MotionDiv>

        <MotionDiv
          variants={shouldReduceMotion ? undefined : fadeUpVariants}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#2d3d33]">Dirección</span>
            <input className="input-base" placeholder="Calle 123" {...register("direccion")} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#2d3d33]">Barrio</span>
            <input className="input-base" placeholder="San Benito" {...register("barrio")} />
          </label>
        </MotionDiv>

        <MotionButton
          {...(shouldReduceMotion ? {} : buttonMotion)}
          variants={shouldReduceMotion ? undefined : fadeUpVariants}
          type="submit"
          disabled={isSubmitting}
          className="buttonprimary w-full rounded-2xl px-6 py-3 font-medium shadow disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creando cuenta..." : "Registrarme"}
        </MotionButton>

        <MotionDiv variants={shouldReduceMotion ? undefined : fadeUpVariants}>
          <p className="text-center text-xs text-[#2d3d33]/60">
            Al registrarte aceptas los terminos y condiciones de uso de EcoRG.
          </p>
        </MotionDiv>
      </form>
    </MotionDiv>
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
