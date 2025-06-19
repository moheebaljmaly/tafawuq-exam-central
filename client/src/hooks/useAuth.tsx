import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email?: string;
  user_metadata?: any;
}

interface UserProfile {
  id: string;
  fullName: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ error?: { message: string } }>;
  signIn: (email: string, password: string) => Promise<{ error?: { message: string }, userProfile?: UserProfile }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: { message: string } }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // Get user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (profile) {
            setUserProfile({
              id: profile.id,
              fullName: profile.full_name,
              role: profile.role,
              createdAt: profile.created_at,
              updatedAt: profile.updated_at
            });
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile) {
          setUserProfile({
            id: profile.id,
            fullName: profile.full_name,
            role: profile.role,
            createdAt: profile.created_at,
            updatedAt: profile.updated_at
          });
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return { error: { message: error.message } };
      }

      return {};
    } catch (error) {
      return { error: { message: 'Network error occurred' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message === 'ACCOUNT_PENDING_APPROVAL') {
          return { error: { message: 'ACCOUNT_PENDING_APPROVAL' } };
        }
        toast.error(error.message);
        return { error: { message: error.message } };
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          const userProfile = {
            id: profile.id,
            fullName: profile.full_name,
            role: profile.role,
            createdAt: profile.created_at,
            updatedAt: profile.updated_at
          };
          return { userProfile };
        }
      }

      return {};
    } catch (error) {
      return { error: { message: 'Login failed' } };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      
      // مسح البيانات المحلية
      localStorage.clear();
      sessionStorage.clear();
      
      // إعادة توجيه للصفحة الرئيسية
      window.location.href = "/";
    } catch (error) {
      console.error("Error during sign out:", error);
      // حتى لو فشل تسجيل الخروج، انتقل للصفحة الرئيسية
      window.location.href = "/";
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  const value = {
    user,
    userProfile,
    signUp,
    signIn,
    signOut,
    resetPassword,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};