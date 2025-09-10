import { useForm } from "react-hook-form"
import { useRef, useEffect, useState } from "react"
// Ajusta la ruta si usas alias "@"
import { api } from "../../lib/api"
import Captcha from "../../components/Captcha"

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  })

  const captchaRef = useRef()
  const [verifiedBanner, setVerifiedBanner] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("verified") === "1") {
      setVerifiedBanner("¡Tu email ha sido verificado! Ahora puedes iniciar sesión.")
    }
  }, [])

  const onSubmit = async (data) => {
    try {
      if (!captchaRef.current) {
        setError("root", { message: "Captcha no disponible. Recarga la página." })
        return
      }

      // Ejecuta captcha invisible
      const captchaToken = await captchaRef.current.execute("login")

      await api.post("/api/auth/login", { ...data, captchaToken })

      // Redirección tras login correcto
      window.location.href = "/mi-cuenta"
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Error al iniciar sesión. Inténtalo de nuevo."
      setError("root", { message: msg })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Inicia sesión</h1>

      {/* Banner de verificación */}
      {verifiedBanner && (
        <div className="bg-green-100 text-green-700 border border-green-300 rounded-md p-3 text-sm">
          {verifiedBanner}
        </div>
      )}

      <div>
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-md border px-3 py-2"
          {...register("email", {
            required: "El email es obligatorio",
            pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" },
          })}
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full rounded-md border px-3 py-2"
          {...register("password", { required: "La contraseña es obligatoria" })}
        />
        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
      </div>

      {/* Captcha reusable */}
      <Captcha ref={captchaRef} />

      {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}

      <button
        className="px-4 py-2 rounded-md bg-black text-white w-full disabled:opacity-60"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>

      {/* Enlace de recuperación */}
      <p className="mt-4 text-sm text-zinc-600 text-center">
        ¿Olvidaste tu contraseña?{" "}
        <a href="/forgot-password" className="text-blue-600 hover:underline">
          Recuperar
        </a>
      </p>
    </form>
  )
}
