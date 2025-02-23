// src/services/auth.service.ts
import supabase from '@utils/supabaseClient';


export const register = async (email: string, password: string) => {
  try {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};