// src/components/Captcha.jsx
import ReCAPTCHA from 'react-google-recaptcha'
import { useRef, forwardRef, useImperativeHandle } from 'react'

const Captcha = forwardRef(({ siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY }, ref) => {
  const internalRef = useRef()
  useImperativeHandle(ref, () => ({
    async execute(action = 'submit') {
      if (!internalRef.current) return null
      const token = await internalRef.current.executeAsync({ action })
      internalRef.current.reset()
      return token
    },
  }))
  return <ReCAPTCHA sitekey={siteKey} size="invisible" ref={internalRef} />
})

export default Captcha
