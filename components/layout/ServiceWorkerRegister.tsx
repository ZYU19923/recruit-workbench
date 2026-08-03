'use client'

import { useEffect, useState } from 'react'

export function ServiceWorkerRegister() {
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
    // Listen for PWA install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
      setShowInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(false)
    }
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const result = await installPrompt.userChoice
    if (result.outcome === 'accepted') {
      setShowInstall(false)
    }
    setInstallPrompt(null)
  }

  return (
    <>
      {showInstall && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-lg max-w-sm animate-in">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white text-lg font-bold">
              R
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">安装招聘工作台</div>
              <div className="text-xs text-[rgb(var(--muted-foreground))] mt-0.5">
                添加到桌面，像原生 App 一样快速打开
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleInstall}
                  className="rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700 transition-colors"
                >
                  安装
                </button>
                <button
                  onClick={() => setShowInstall(false)}
                  className="rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-xs font-medium hover:bg-[rgb(var(--accent))] transition-colors"
                >
                  以后再说
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
