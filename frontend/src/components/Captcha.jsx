import ReCAPTCHA from 'react-google-recaptcha'
import { useRef, forwardRef, useImperativeHandle } from 'react'

/**
 * Captcha invisible (reCAPTCHA v2) con API basada en ref:
 * - execute(action?): Promise<string|null>
 * - reset(): void
 * - isReady(): boolean
 *
 * Modo dev:
 * - Usa clave de PRUEBAS si no hay VITE_RECAPTCHA_SITE_KEY
 * - Si VITE_DISABLE_CAPTCHA === 'true', no monta el widget y devuelve un token ficticio
 */
const TEST_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' // clave pública de pruebas
const DISABLE = import.meta.env.VITE_DISABLE_CAPTCHA === 'true'

const Captcha = forwardRef(
  (
    {
      siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || TEST_KEY,
      badge = 'bottomright', // 'bottomright' | 'bottomleft' | 'inline'
      theme = 'light',       // 'light' | 'dark'
      hl = 'es',             // idioma
    },
    ref
  ) => {
    // Guard SSR
    if (typeof window === 'undefined') return null

    const internalRef = useRef(null)

    // Si está desactivado (dev), exponemos un stub que no rompe flujos
    useImperativeHandle(ref, () => {
      if (DISABLE) {
        return {
          async execute(_action = 'submit') {
            // token ficticio; tu backend puede ignorarlo en dev si quiere
            return 'dev-bypass-token'
          },
          reset() {},
          isReady() { return true },
        }
      }
      return {
        async execute(_action = 'submit') {
          if (!internalRef.current) return null
          try {
            const token = await internalRef.current.executeAsync()
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
      }
    }, [])

    if (DISABLE) {
      // No montamos el widget real en dev si está desactivado
      return null
    }

    return (
      <ReCAPTCHA
        ref={internalRef}
        sitekey={siteKey}
        size="invisible"
        badge={badge}
        theme={theme}
        hl={hl}
        onExpired={() => {
          try { internalRef.current?.reset() } catch {}
          console.warn('[Captcha] token expirado')
        }}
        onErrored={() => {
          // No mates el flujo si el script está bloqueado por adblock
          console.warn('[Captcha] error cargando reCAPTCHA (bloqueador o red). Se devolverá null en execute().')
        }}
      />
    )
  }
)

export default Captcha
