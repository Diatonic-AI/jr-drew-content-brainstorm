import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function ProtectedRoute() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(() => auth.currentUser);

  useEffect(() => onAuthStateChanged(auth, u => { setUser(u); setReady(true); }), []);

  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}