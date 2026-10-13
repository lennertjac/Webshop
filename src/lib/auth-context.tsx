'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getSupabase, isSupabaseConfigured } from './supabase';

export interface WebshopUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  contactPersonId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface AuthContextType {
  user: WebshopUser | null;
  loading: boolean;
  configured: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<WebshopUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapProfile = (d: any): WebshopUser => ({
  id: d.user_id,
  email: d.email,
  firstName: d.first_name,
  lastName: d.last_name,
  phone: d.phone ?? undefined,
  address: d.address,
  city: d.city,
  postalCode: d.postal_code,
  country: d.country,
  contactPersonId: d.contact_person_id ?? undefined,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<WebshopUser | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!userId) return setUser(null);
    const { data } = await getSupabase().from('webshop_user_profiles').select('*').eq('user_id', userId).maybeSingle();
    setUser(data ? mapProfile(data) : null);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = getSupabase();
    supabase.auth
      .getSession()
      .then(({ data }) => loadProfile(data.session?.user.id))
      .catch((err) => console.error('Auth check failed', err))
      .finally(() => setLoading(false));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer to avoid deadlocking the auth client inside its own callback.
      setTimeout(() => void loadProfile(session?.user.id), 0);
    });
    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      configured: isSupabaseConfigured,
      login: async (email, password) => {
        const { error } = await getSupabase().auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      register: async (d) => {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.signUp({ email: d.email, password: d.password });
        if (error) throw error;
        if (!data.user) throw new Error('Registration failed');
        const { error: profileError } = await supabase.from('webshop_user_profiles').insert({
          user_id: data.user.id,
          email: d.email,
          first_name: d.firstName,
          last_name: d.lastName,
          phone: d.phone || null,
          address: d.address,
          city: d.city,
          postal_code: d.postalCode,
          country: d.country,
        });
        if (profileError) throw profileError;
        await loadProfile(data.user.id);
      },
      logout: async () => {
        const { error } = await getSupabase().auth.signOut();
        if (error) throw error;
        setUser(null);
      },
      updateProfile: async (d) => {
        if (!user) throw new Error('Not logged in');
        const { error } = await getSupabase()
          .from('webshop_user_profiles')
          .update({
            first_name: d.firstName,
            last_name: d.lastName,
            phone: d.phone,
            address: d.address,
            city: d.city,
            postal_code: d.postalCode,
            country: d.country,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
        if (error) throw error;
        setUser({ ...user, ...d });
      },
    }),
    [user, loading, loadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
