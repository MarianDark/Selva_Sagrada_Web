// frontend/src/pages/Login.jsx
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,           // ← usa esto en vez de ref manual
    formState: { isSubmitting }
  } = useForm();

  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const passEl = useRef(null); // opcional, pero lo fusionamos bien

  const { loginSuccess } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const onSubmit = async (form) => {
    setErrorMsg('');
    try {
      await api.post('/auth/login', {
        email: String(form.email || '').trim(),
        password: form.password
      });

      await loginSuccess();

      // higiene
      setValue('password', '');
      passEl.current?.blur?.();

      const next = searchParams.get('next') || '/mi-cuenta';
      navigate(next, { replace: true });
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Error iniciando sesión';
      setErrorMsg(msg);
      setValue('password', '');
      // enfoca usando RHF para no romper el registro
      setTimeout(() => setFocus('password'), 0);
    }
  };

  // fusionamos refs: mantenemos la de RHF y guardamos el elemento en passEl
  const passwordReg = register('password', { required: true });

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
          {...register('email', { required: true })}
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
              passwordReg.ref(el);   // ← mantiene RHF
              passEl.current = el;   // ← y tú sigues teniendo la ref
            }}
            type={showPassword ? 'text' : 'password'}
            placeholder="********"
            autoComplete="current-password"
            className="w-full rounded-md border px-3 py-2 pr-10 focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={showPassword ? 'true' : 'false'}
            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {showPassword ? (
              <img src="/ojo-turco.jpg" alt="" className="w-5 h-5" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-600" aria-hidden="true">
                <path fill="currentColor" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 4.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              </svg>
            )}
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
        aria-busy={isSubmitting ? 'true' : 'false'}
      >
        {isSubmitting ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
