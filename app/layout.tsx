import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ClientProviders } from '@/components/layout/ClientProviders'
import { ServiceWorkerRegister } from '@/components/layout/ServiceWorkerRegister'

export const metadata: Metadata = {
  title: '招聘工作台',
  description: '个人招聘工作管理平台',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, title: '工作台', statusBarStyle: 'black-translucent' },
}

export const viewport: Viewport = {
  themeColor: '#ec4899',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen antialiased">
        <ServiceWorkerRegister />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
