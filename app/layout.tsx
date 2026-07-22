import type { Metadata } from 'next'
import './globals.css'
import { ClientProviders } from '@/components/layout/ClientProviders'

export const metadata: Metadata = {
  title: '招聘工作台',
  description: '个人招聘工作管理平台',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
