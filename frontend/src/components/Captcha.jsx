import ReCAPTCHA from 'react-google-recaptcha'
import { useRef, forwardRef, useImperativeHandle } from 'react'

// Componente reusable para Google reCAPTCHA
// Props:
// - siteKey: clave de sitio (por defecto usa import.meta.env.VITE_RECAPTCHA_SITE_KEY)
// Uso:
// const captchaRef = useRef()
// const token = await captchaRef.current.execute()

const Captcha = forwardRef(
  ({ siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY }, ref) => {
    const internalRef = useRef()

    useImperativeHandle(ref, () => ({
      async execute(action = 'submit') {
        if (!internalRef.current) return null
        const token = await internalRef.current.executeAsync({ action })
        internalRef.current.reset()
        return token
      },
    }))

    return (
      <ReCAPTCHA
        sitekey={siteKey}
        size="invisible"
        ref={internalRef}
      />
    )
  }
)

export default Captcha
