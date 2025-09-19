import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = useForm();

  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passEl = useRef(null);

  const { loginSuccess } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const onSubmit = async (form) => {
    setErrorMsg("");
    try {
      await api.post("/auth/login", {
        email: String(form.email || "").trim(),
        password: form.password,
      });

      await loginSuccess();

      setValue("password", "");
      passEl.current?.blur?.();

      const next = searchParams.get("next") || "/mi-cuenta";
      navigate(next, { replace: true });
    } catch (e) {
      const msg =
        e?.response?.data?.message || e?.message || "Error iniciando sesión";
      setErrorMsg(msg);
      setValue("password", "");
      setTimeout(() => setFocus("password"), 0);
    }
  };

  const passwordReg = register("password", { required: true });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 space-y-4 bg-white rounded-xl shadow"
      autoComplete="on"
      noValidate
    >
      <h1 className="text-2xl font-bold text-emerald-700">Inicia sesión</h1>

      <div className="space-y-2">
        <label className="block text-sm text-gray-700">Email</label>
        <input
          {...register("email", { required: true })}
          placeholder="tucorreo@dominio.com"
          type="email"
          inputMode="email"
          autoComplete="email"
          className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-gray-700">Contraseña</label>
        <div className="relative">
          <input
            {...passwordReg}
            ref={(el) => {
              passwordReg.ref(el);
              passEl.current = el;
            }}
            type={showPassword ? "text" : "password"}
            placeholder="********"
            autoComplete="current-password"
            className="w-full rounded-md border px-3 py-2 pr-12 focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            aria-pressed={showPassword ? "true" : "false"}
            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <img
              src={showPassword ? "/eye_closed_icon.png" : "/ojo-turco.jpg"}
              alt=""
              className="w-5 h-5 object-contain"
            />
          </button>
        </div>
      </div>

      {errorMsg && (
        <p className="text-red-600 text-sm" role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-600 text-white rounded-md py-2 font-medium hover:bg-emerald-700 disabled:opacity-60"
        aria-busy={isSubmitting ? "true" : "false"}
      >
        {isSubmitting ? "Entrando…" : "Entrar"}
      </button>

      <p className="text-[11px] text-center text-zinc-500 mt-2">
        Icono de ocultar por{" "}
        <a
          className="underline"
          href="https://www.flaticon.es/iconos-gratis/ojo-de-cerca"
          target="_blank"
          rel="noopener noreferrer"
        >
          Rahul Kaklotar (Flaticon)
        </a>
      </p>
    </form>
  );
}
