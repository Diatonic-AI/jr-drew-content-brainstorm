import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { auth } from '@/lib/firebase/client';
import type { UserProfile } from '@/types/user';
import { useAuthStore } from '@/stores/authStore';
import { getUserProfile, createUserProfileIfNeeded } from '@/services/user.service';
import { getOrganization } from '@/services/organization.service';
import type { OrgDoc } from '@/schemas/organization';

interface AuthContextValue {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  currentOrg: OrgDoc | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentOrg, setCurrentOrg] = useState<OrgDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { login, logout, updateUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          setError(null);
          
          if (firebaseUser) {
            // User is signed in
            setUser(firebaseUser);
            
            // Get or create user profile in Firestore
            const profile = await createUserProfileIfNeeded(firebaseUser);
            setUserProfile(profile);
            
            // Load full organization data
            if (profile.currentOrgId) {
              try {
                const org = await getOrganization(profile.currentOrgId);
                if (org) {
                  setCurrentOrg(org);
                } else {
                  console.warn(`Organization ${profile.currentOrgId} not found for user ${firebaseUser.uid}`);
                  setError(new Error('Organization not found. Please contact support.'));
                }
              } catch (orgError) {
                console.error('Failed to load organization:', orgError);
                setError(orgError instanceof Error ? orgError : new Error('Failed to load organization'));
              }
            }
            
            // Get fresh token
            const token = await firebaseUser.getIdToken();
            
            // Sync with Zustand store
            login({
              user: profile,
              accessToken: token,
              permissions: [] // TODO: Load from custom claims or Firestore
            });
            
          } else {
            // User is signed out
            setUser(null);
            setUserProfile(null);
            setCurrentOrg(null);
            logout();
          }
        } catch (err) {
          console.error('Auth state change error:', err);
          setError(err instanceof Error ? err : new Error('Authentication error'));
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Auth observer error:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, [login, logout]);

  const value: AuthContextValue = {
    user,
    userProfile,
    currentOrg,
    loading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
