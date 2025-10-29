'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import Cookies from 'js-cookie'
import { auth, googleProvider } from '@/lib/firebase/config'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (input: SignupInput) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

interface SignupInput {
  email: string
  password: string
  firstName: string
  lastName: string
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const AUTH_COOKIE = 'diatonicAuthToken'

async function persistToken(user: User | null) {
  if (!user) {
    Cookies.remove(AUTH_COOKIE)
    return
  }
  const token = await user.getIdToken()
  Cookies.set(AUTH_COOKIE, token, { expires: 7, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser)
      await persistToken(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email: string, password: string) {
        const credential = await signInWithEmailAndPassword(auth, email, password)
        await persistToken(credential.user)
      },
      async signup({ email, password, firstName, lastName }: SignupInput) {
        const credential = await createUserWithEmailAndPassword(auth, email, password)
        if (firstName || lastName) {
          await updateProfile(credential.user, { displayName: `${firstName} ${lastName}`.trim() })
        }
        await persistToken(credential.user)
      },
      async loginWithGoogle() {
        const popupProvider = googleProvider instanceof GoogleAuthProvider ? googleProvider : new GoogleAuthProvider()
        const credential = await signInWithPopup(auth, popupProvider)
        await persistToken(credential.user)
      },
      async logout() {
        await signOut(auth)
        await persistToken(null)
      }
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
