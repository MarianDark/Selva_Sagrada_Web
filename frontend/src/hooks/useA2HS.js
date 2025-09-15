import { useEffect, useState, useCallback } from 'react'

const LS_KEY_HIDE_UNTIL = 'a2hs_hide_until'
const HIDE_DAYS = 7 // No mostrar de nuevo hasta en X días

const getIsStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)')?.matches ||
  window.navigator.standalone === true

const isIOS = () => {
  const ua = window.navigator.userAgent
  return /iPhone|iPad|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document)
}

const nowPlusDays = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

const isAfter = (iso) => {
  if (!iso) return true
  return new Date() > new Date(iso)
}

export function useA2HS() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)
  const [mode, setMode] = useState('') // 'android' | 'ios' | ''
  const [isStandalone, setIsStandalone] = useState(getIsStandalone())

  const hideForAWhile = useCallback(() => {
    localStorage.setItem(LS_KEY_HIDE_UNTIL, nowPlusDays(HIDE_DAYS))
    setShowBanner(false)
  }, [])

  useEffect(() => {
    setIsStandalone(getIsStandalone())
    if (getIsStandalone()) return // ya instalada → no mostrar

    const hiddenUntil = localStorage.getItem(LS_KEY_HIDE_UNTIL)
    if (!isAfter(hiddenUntil)) return // aún dentro del periodo de ocultamiento

    // iOS no dispara beforeinstallprompt
    if (isIOS()) {
      setMode('ios')
      setShowBanner(true)
      return
    }

    const onBIP = (e) => {
      // Evita el mini-infobar y guarda el evento
      e.preventDefault()
      setDeferredPrompt(e)
      setMode('android')
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', onBIP)
    return () => window.removeEventListener('beforeinstallprompt', onBIP)
  }, [])

  const triggerInstall = useCallback(async () => {
    if (!deferredPrompt) return
    // muestra prompt nativo (Android/Chrome)
    deferredPrompt.prompt()
    await deferredPrompt.userChoice // { outcome: 'accepted' | 'dismissed' }
    hideForAWhile()
    setDeferredPrompt(null)
  }, [deferredPrompt, hideForAWhile])

  const dismiss = useCallback(() => {
    hideForAWhile()
  }, [hideForAWhile])

  // API "simple" compatible con tu segunda versión
  const canInstall = showBanner && mode === 'android'
  const promptInstall = triggerInstall

  return {
    // API simple
    canInstall,
    promptInstall,
    // API completa
    showBanner, // true si debemos mostrar UI (Android o iOS)
    mode,       // 'android' | 'ios' | ''
    triggerInstall, // igual que promptInstall
    dismiss,        // cierra/oculta por N días
    isStandalone,
  }
}
