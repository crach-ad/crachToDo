"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser 
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

// Extend the User type to include all necessary fields
type User = {
  id: string
  username: string
  email: string
  rank: string
  level: number
  currentXP: number
  requiredXP: number
  createdAt: string
  lastLoginAt: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (username: string, email: string, password: string) => Promise<boolean>
  updateUserProfile: (data: Partial<User>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Auth Provider component that handles Firebase authentication
 * and user profile management with Firestore
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Listen for auth state changes and sync with Firestore user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true)
      
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid)
          const userDoc = await getDoc(userDocRef)
          
          if (userDoc.exists()) {
            // User exists in Firestore, use that data
            const userData = userDoc.data() as User
            setUser(userData)
            
            // Update last login time
            await updateDoc(userDocRef, { 
              lastLoginAt: new Date().toISOString() 
            })
          } else {
            // User exists in Auth but not in Firestore
            // This shouldn't normally happen, but create a new user profile just in case
            const newUser: User = {
              id: firebaseUser.uid,
              username: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              rank: 'E',
              level: 1,
              currentXP: 0,
              requiredXP: 100,
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
            }
            
            // Save user to Firestore
            await setDoc(userDocRef, newUser)
            setUser(newUser)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          // Handle error gracefully - maybe redirect to error page
        }
      } else {
        setUser(null)
      }
      
      setIsLoading(false)
    })
    
    // Cleanup subscription
    return () => unsubscribe()
  }, [])

  // Set up a subscription to the user document to react to changes
  useEffect(() => {
    if (!user?.id) return () => {}
    
    const userDocRef = doc(db, 'users', user.id)
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setUser(prevUser => ({
          ...prevUser,
          ...doc.data(),
        } as User))
      }
    })
    
    return () => unsubscribe()
  }, [user?.id])

  /**
   * Log in a user with email and password
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Sign in with Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (error: any) {
      console.error("Login failed:", error.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Register a new user with email and password
   */
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Set display name
      await updateProfile(userCredential.user, { displayName: username })
      
      // Create user document in Firestore
      const newUser: User = {
        id: userCredential.user.uid,
        username,
        email,
        rank: 'E',
        level: 1,
        currentXP: 0,
        requiredXP: 100,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      }
      
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser)
      
      return true
    } catch (error: any) {
      console.error("Registration failed:", error.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Update user profile data
   */
  const updateUserProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user?.id) return false
    
    try {
      const userDocRef = doc(db, 'users', user.id)
      await updateDoc(userDocRef, data)
      return true
    } catch (error) {
      console.error("Profile update failed:", error)
      return false
    }
  }

  /**
   * Log out the user
   */
  const logout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        logout, 
        register,
        updateUserProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to access authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
