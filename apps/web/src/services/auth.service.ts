import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
  type User
} from 'firebase/auth'
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore'
import { auth, googleProvider, db } from '@/lib/firebase/client'

const AUTH_TOKEN_KEY = 'diatonicAuthToken'

async function persistToken(user: User | null) {
  if (!user) {
    sessionStorage.removeItem(AUTH_TOKEN_KEY)
    return
  }
  const token = await user.getIdToken()
  sessionStorage.setItem(AUTH_TOKEN_KEY, token)
}

export interface SignupInput {
  email: string
  password: string
  firstName: string
  lastName: string
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  await persistToken(credential.user)
  return credential.user
}

export async function signupWithEmail(input: SignupInput): Promise<User> {
  const { email, password, firstName, lastName } = input
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const user = credential.user
  
  if (firstName || lastName) {
    await updateProfile(user, { 
      displayName: `${firstName} ${lastName}`.trim() 
    })
  }
  
  // Create organization for the user
  const orgRef = doc(collection(db, 'orgs'))
  const orgId = orgRef.id
  const orgName = `${firstName}'s Workspace`
  
  await setDoc(orgRef, {
    id: orgId,
    name: orgName,
    ownerId: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    settings: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      workHoursStart: 9,
      workHoursEnd: 17
    }
  })
  
  // Create user document
  await setDoc(doc(db, 'users', user.uid), {
    id: user.uid,
    email: user.email,
    displayName: `${firstName} ${lastName}`.trim(),
    firstName,
    lastName,
    currentOrgId: orgId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    emailVerified: false,
    mfaEnabled: false
  })
  
  // Add user as owner in org members
  await setDoc(doc(db, 'orgs', orgId, 'members', user.uid), {
    userId: user.uid,
    role: 'owner',
    displayName: `${firstName} ${lastName}`.trim(),
    email: user.email,
    joinedAt: serverTimestamp()
  })
  
  // Note: We don't send verification email here
  // The signup page will generate a code and call sendVerificationEmail function
  
  await persistToken(user)
  return user
}

export async function loginWithGoogle(): Promise<User> {
  const credential = await signInWithPopup(auth, googleProvider)
  await persistToken(credential.user)
  return credential.user
}

export async function logoutUser(): Promise<void> {
  await signOut(auth)
  await persistToken(null)
}
