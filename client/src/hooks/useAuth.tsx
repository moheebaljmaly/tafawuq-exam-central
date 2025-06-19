import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

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
        const session = localStorage.getItem('user_session');
        if (session) {
          const parsed = JSON.parse(session);
          setUser(parsed.user);
          setUserProfile(parsed.userProfile);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, role })
      });

      const data = await response.json();

      if (data.success) {
        const newUser = { id: data.profile.id, email };
        const newProfile = data.profile;
        
        setUser(newUser);
        setUserProfile(newProfile);
        
        // Store session
        localStorage.setItem('user_session', JSON.stringify({
          user: newUser,
          userProfile: newProfile
        }));

        return {};
      } else {
        return { error: { message: data.error || 'Registration failed' } };
      }
    } catch (error) {
      return { error: { message: 'Network error occurred' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // For demo purposes, create a session based on email
      const mockProfile: UserProfile = {
        id: `user_${Date.now()}`,
        fullName: email.split('@')[0],
        role: email.includes('teacher') ? 'teacher' : email.includes('admin') ? 'admin' : 'student',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const mockUser: User = {
        id: mockProfile.id,
        email,
        user_metadata: { role: mockProfile.role }
      };

      setUser(mockUser);
      setUserProfile(mockProfile);

      // Store session
      localStorage.setItem('user_session', JSON.stringify({
        user: mockUser,
        userProfile: mockProfile
      }));

      return { userProfile: mockProfile };
    } catch (error) {
      return { error: { message: 'Login failed' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('user_session');
  };

  const resetPassword = async (email: string) => {
    // Mock password reset
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {};
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