import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router-dom";
import { AuthAPI, getFriendlyApiError } from "../api/api";
import { notifyError, notifySuccess } from "../utils/feedback";

const schema = z
  .object({
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Repetí la contraseña"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [success, setSuccess] = useState(false);
  const invalidLink = useMemo(() => !token, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = async ({ password }) => {
    try {
      await AuthAPI.resetPassword(token, password);
      setSuccess(true);
      notifySuccess("Contraseña actualizada correctamente.");
    } catch (err) {
      notifyError(
        getFriendlyApiError(
          err,
          "No pudimos restablecer la contraseña. Verificá el enlace e intentá nuevamente."
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbf4_0%,#ffffff_100%)] px-6 py-12">
      <div className="mx-auto max-w-md rounded-[28px] border border-[#dce8ce] bg-white p-6 shadow-[0_18px_44px_rgba(59,89,34,0.1)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
          EcoRG
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[#203014]">Restablecer contraseña</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Elegí una nueva contraseña para volver a acceder a tu cuenta.
        </p>

        {invalidLink ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            El enlace de recuperación es inválido o está incompleto.
          </div>
        ) : null}

        {success ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-[#dce8ce] bg-[#f7fbf3] px-4 py-3 text-sm text-[#35561a]">
              Tu contraseña se actualizó correctamente. Ya podés iniciar sesión con la nueva clave.
            </div>
            <Link
              to="/login"
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-[#66a939] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732]"
            >
              Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#2d3d33]">Nueva contraseña</span>
              <input
                type="password"
                className="input-base"
                placeholder="Mínimo 6 caracteres"
                {...register("password")}
              />
              {errors.password ? (
                <p role="alert" className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#2d3d33]">Repetir contraseña</span>
              <input
                type="password"
                className="input-base"
                placeholder="Repetí la contraseña"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword ? (
                <p role="alert" className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              ) : null}
            </label>

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || invalidLink}
                className="inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-[#66a939] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Guardando..." : "Guardar nueva contraseña"}
              </button>
              <Link
                to="/login"
                className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-[#dbe8cc] px-4 py-3 text-sm font-semibold text-[#35561a] transition hover:bg-[#f7fbf1]"
              >
                Volver al login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
