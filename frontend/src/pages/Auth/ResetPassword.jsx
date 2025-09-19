import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";

const passwordSchema = z
  .string()
  .min(8, "Mínimo 8 caracteres")
  .regex(/[A-Z]/, "Incluye mayúscula")
  .regex(/[a-z]/, "Incluye minúscula")
  .regex(/[0-9]/, "Incluye número")
  .regex(/[^A-Za-z0-9]/, "Incluye símbolo");

const schema = z
  .object({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const next = searchParams.get("next") || "/mi-cuenta";

  const [ok, setOk] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });

  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const onSubmit = async ({ password }) => {
    try {
      setOk("");
      setError("");
      await api.post("/auth/reset-password", { password, token });
      setOk("Contraseña actualizada. Redirigiendo al inicio de sesión…");
      reset({ password: "", confirm: "" });
      setTimeout(
        () =>
          navigate(
            `/login?reset=1${next ? `&next=${encodeURIComponent(next)}` : ""}`,
            { replace: true }
          ),
        1500
      );
    } catch (e) {
      const msg =
        e?.response?.data?.message || "Error al actualizar contraseña";
      setError(msg);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2 text-red-600">
          Token faltante
        </h1>
        <p className="text-zinc-600 mb-4">
          No se encontró el token de recuperación en la URL.
        </p>
        <Link
          to="/forgot-password"
          className="text-emerald-700 font-medium hover:underline"
        >
          Solicitar nuevo enlace de recuperación
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold text-emerald-700 mb-4">
        Restablecer contraseña
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Nueva contraseña"
            className="w-full rounded-md border px-3 py-2 pr-12 focus:ring-2 focus:ring-emerald-500"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPass ? "true" : "false"}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <img
              src={showPassword ? "/ojo-turco.jpg" : "/eye_closed_icon.png"}
              alt=""
              className="h-5 w-5 object-contain"
            />
          </button>
          {errors.password ? (
            <p className="text-xs text-red-600 mt-1">
              {errors.password.message}
            </p>
          ) : (
            <ul className="text-xs text-zinc-600 mt-1 list-disc ml-5">
              <li>Mínimo 8 caracteres</li>
              <li>Incluye mayúscula, minúscula, número y símbolo</li>
            </ul>
          )}
        </div>

        <div className="relative">
          <input
            type={showConf ? "text" : "password"}
            placeholder="Confirmar contraseña"
            className="w-full rounded-md border px-3 py-2 pr-12 focus:ring-2 focus:ring-emerald-500"
            {...register("confirm")}
          />
          <button
            type="button"
            onClick={() => setShowConf((v) => !v)}
            aria-label={
              showConf
                ? "Ocultar confirmación de contraseña"
                : "Mostrar confirmación de contraseña"
            }
            aria-pressed={showConf ? "true" : "false"}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <img
              src={showPassword ? "/ojo-turco.jpg" : "/eye_closed_icon.png"}
              alt=""
              className="h-5 w-5 object-contain"
            />
          </button>
          {errors.confirm && (
            <p className="text-xs text-red-600 mt-1">
              {errors.confirm.message}
            </p>
          )}
        </div>

        {ok && <p className="text-green-600">{ok}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-600 text-white py-2 rounded-md font-medium hover:bg-emerald-700 disabled:opacity-60"
        >
          {isSubmitting ? "Actualizando…" : "Cambiar contraseña"}
        </button>

      </form>
    </div>
  );
}
