import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import supabase from '@utils/supabaseClient';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Erreur lors de la récupération de la session:', error);
      }
      console.log('Session récupérée au démarrage:', data.session?.user);
      setUser(data.session?.user ?? null);
    };
  
    getSession();
    
    const { subscription } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      console.log('Changement d\'état d\'authentification:', event, session?.user);
      setUser(session?.user ?? null);
    });

    console.log('Souscription créée:', subscription);
  
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      } else {
        console.warn('Aucune souscription trouvée pour désinscription.');
      }
    };
    
  }, []);
  
  

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    console.log('Utilisateur récupéré après connexion:', data.user); // Vérifiez ce que contient data.user
    setUser(data.user);  // Assurez-vous que data.user est bien défini
  };
  
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const register = async (email: string, password: string) => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
