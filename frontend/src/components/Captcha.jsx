import ReCAPTCHA from 'react-google-recaptcha'
import { useRef, forwardRef, useImperativeHandle } from 'react'

/**
 * Captcha invisible (reCAPTCHA v2) con API basada en ref:
 * - execute(action?): Promise<string|null>
 * - reset(): void
 * - isReady(): boolean
 *
 * NOTA: En v2 invisible el "action" no se usa realmente (es de v3).
 *       Lo aceptamos por compatibilidad con tu código.
 */
const Captcha = forwardRef(
  (
    {
      siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY,
      badge = 'bottomright', // 'bottomright' | 'bottomleft' | 'inline'
      theme = 'light',       // 'light' | 'dark'
      hl = 'es',             // idioma
    },
    ref
  ) => {
    const internalRef = useRef(null)

    useImperativeHandle(ref, () => ({
      async execute(_action = 'submit') {
        if (!internalRef.current) return null
        try {
          // v2 invisible: executeAsync() sin parámetros
          const token = await internalRef.current.executeAsync()
          // siempre reseteamos para futuras ejecuciones
          try { internalRef.current.reset() } catch {}
          return token
        } catch (err) {
          console.error('[Captcha] execute error:', err)
          try { internalRef.current.reset() } catch {}
          return null
        }
      },
      reset() {
        try { internalRef.current?.reset() } catch {}
      },
      isReady() {
        return !!internalRef.current
      },
    }))

    // Guard para SSR
    if (typeof window === 'undefined') return null

    return (
      <ReCAPTCHA
        ref={internalRef}
        sitekey={siteKey}
        size="invisible"
        badge={badge}
        theme={theme}
        hl={hl}
        onExpired={() => {
          // En invisible casi no ocurre, pero lo dejamos por si acaso
          try { internalRef.current?.reset() } catch {}
          console.warn('[Captcha] token expirado')
        }}
        onErrored={() => {
          console.warn('[Captcha] error cargando reCAPTCHA (¿bloqueador?)')
        }}
      />
    )
  }
)

export default Captcha
