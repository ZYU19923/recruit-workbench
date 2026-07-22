'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: { email: string } | null
  session: null
  isLoading: boolean
  supabase: null
  isConfigured: false
  signIn: (email: string, _password: string) => Promise<{ error: string | null }>
  signUp: (email: string, _password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  supabase: null,
  isConfigured: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('recruit-workbench-user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, _password: string) => {
    const u = { email }
    localStorage.setItem('recruit-workbench-user', JSON.stringify(u))
    setUser(u)
    router.push('/')
    return { error: null }
  }

  const signUp = async (email: string, _password: string) => {
    const u = { email }
    localStorage.setItem('recruit-workbench-user', JSON.stringify(u))
    setUser(u)
    router.push('/')
    return { error: null }
  }

  const signOut = async () => {
    localStorage.removeItem('recruit-workbench-user')
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, session: null, isLoading, supabase: null, isConfigured: false, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
