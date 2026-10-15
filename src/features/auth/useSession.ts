import { useState } from 'react';
import type { Role } from '../../types';
import { repo } from '../../services/repository';

type Session = { role: Role; name: string };
const key = 'sep_session';

export function useSession() {
  const [session, setSession] = useState<Session | null>(() => JSON.parse(sessionStorage.getItem(key) || 'null'));
  const login = (role: Role) => { const next = { role, name: role === 'student' ? repo.profile().fullName : 'Examination Office' }; sessionStorage.setItem(key, JSON.stringify(next)); setSession(next); };
  const logout = () => { sessionStorage.removeItem(key); setSession(null); };
  return { session, login, logout };
}
