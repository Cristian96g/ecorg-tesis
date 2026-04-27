import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthAPI, getFriendlyApiError, setToken } from "../../api/api";
import { useAuth } from "../../state/auth";
import { toast } from "react-toastify";

const schema = z.object({
  email: z.string().min(1, "El email es obligatorio").email("Formato de email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/";
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), mode: "onSubmit" });

  const onSubmit = async (data) => {
    setServerError("");
    let loadingToastId = null;
    let loadingResolved = false;

    try {
      loadingToastId = toast.loading("Ingresando...");
      const { token, user } = await AuthAPI.login(data.email, data.password);

      toast.update(loadingToastId, {
        render: "Inicio de sesión exitoso",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      loadingResolved = true;

      setToken(token);
      login(user);
      navigate(next, { replace: true });
    } catch (err) {
      const apiError = err?.response?.data?.error;
      let friendly = getFriendlyApiError(err, "No pudimos iniciar sesión. Verificá tus datos.");

      if (apiError === "USER_NOT_FOUND") {
        friendly = "El usuario no está registrado. Necesitás crear tu cuenta.";
      } else if (apiError === "WRONG_PASSWORD") {
        friendly = "La contraseña es incorrecta. Probá nuevamente.";
      } else if (apiError === "MISSING_FIELDS") {
        friendly = "Completá email y contraseña.";
      }

      if (import.meta.env.DEV) {
        console.error("LOGIN_FORM_ERROR", err);
      }

      setServerError(friendly);
      toast.error(friendly);
      if (loadingToastId && !loadingResolved) {
        toast.dismiss(loadingToastId);
      }
    } finally {
      if (loadingToastId && !loadingResolved) {
        toast.dismiss(loadingToastId);
      }
    }
  };

  const [show, setShow] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-left">
        <h2 className="text-2xl font-semibold text-[#203014]">Bienvenido/a</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Ingresá tus credenciales para continuar usando EcoRG.
        </p>
      </div>

      {serverError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#2d3d33]">Email</span>
        <input type="email" className="input-base" placeholder="tu@correo.com" {...register("email")} />
        {errors.email && <p role="alert" className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#2d3d33]">Contraseña</span>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            className="input-base"
            placeholder="••••••••"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#2d3d33]/60 hover:text-[#2d3d33]"
            aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {show ? eyeOff : eye}
          </button>
        </div>
        {errors.password && <p role="alert" className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </label>

      <div className="flex items-center justify-between text-sm">
        <label className="inline-flex select-none items-center gap-2 text-[#2d3d33]/80">
          <input type="checkbox" className="accent-[#66a939]" />
          Recordarme
        </label>
        <Link to="/login" className="text-[#4f7a2f] hover:underline">
          ¿Necesitás ayuda para ingresar?
        </Link>
      </div>

      <button type="submit" disabled={isSubmitting} className="buttonprimary w-full rounded-2xl px-6 py-3 font-medium shadow">
        {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
      </button>
    </form>
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
