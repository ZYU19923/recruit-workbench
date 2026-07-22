'use client'

import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MemoPanel } from './MemoPanel'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col ml-56">
        <TopBar />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <MemoPanel />
    </div>
  )
}
