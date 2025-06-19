import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userProfile: any;
  signUp: (email: string, password: string, fullName: string, role: 'student' | 'teacher') => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; userProfile?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Set loading to true initially
    setLoading(true);
    
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            // Try to fetch the user profile from the database
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error || !profile) {
              console.error('Error fetching profile:', error);
              // Set a default profile if we couldn't fetch one
              setUserProfile({ 
                id: session.user.id, 
                role: session.user.user_metadata?.role || 'student',
                full_name: session.user.user_metadata?.full_name || 'طالب'
              });
              console.log('Set default user profile with metadata from auth');
            } else {
              // Set the fetched profile
              setUserProfile(profile);
              console.log('Fetched user profile:', profile);
            }
          } catch (error) {
            console.error('Error setting profile:', error);
            // Fallback to default profile
            setUserProfile({ 
              id: session.user.id, 
              role: 'student',
              full_name: session.user.user_metadata?.full_name || 'طالب'
            });
          }
        }
        
        // Set loading to false after initial session check
        setLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);

        // Get the full user profile if the user is authenticated
        if (session?.user) {
          try {
            // Try to fetch the user profile from the database
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error || !profile) {
              console.error('Error fetching profile:', error);
              // Set a default profile if we couldn't fetch one
              setUserProfile({ 
                id: session.user.id, 
                role: session.user.user_metadata?.role || 'student',
                full_name: session.user.user_metadata?.full_name || 'طالب'
              });
              console.log('Set default user profile with metadata from auth');
            } else {
              // Set the fetched profile
              setUserProfile(profile);
              console.log('Fetched user profile:', profile);
            }
          } catch (error) {
            console.error('Error setting profile:', error);
            // Fallback to default profile
            setUserProfile({ 
              id: session.user.id, 
              role: 'student',
              full_name: session.user.user_metadata?.full_name || 'طالب'
            });
          }
        } else {
          setUserProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: 'student' | 'teacher') => {
    try {
      // إذا كان الدور هو "معلم"، يتم تسجيله كـ "معلم قيد الانتظار"
      const roleToRegister = role === 'teacher' ? 'pending_teacher' : 'student';

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            role: roleToRegister // استخدام الدور الجديد
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      if (role === 'student') {
        toast.success('تم إنشاء حساب الطالب بنجاح! يمكنك البدء الآن.');
      } else {
        toast.info('تم تسجيل حساب المعلم بنجاح! سيتم مراجعته من قبل المسؤول.');
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        toast.error('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
        return { error: new Error('Missing credentials') };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error || !data.user) {
        console.error('Sign in error from Supabase:', error);
        toast.error(error?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
        return { error: error || new Error('Invalid credentials') };
      }
      
      console.log('Successfully signed in user:', data.user.email);
      
      // احصل على الدور مباشرة من بيانات المصادقة الأساسية. هذا هو المصدر الموثوق.
      const authRole = data.user.user_metadata?.role;

      if (authRole === 'pending_teacher') {
        // هذا المستخدم هو معلم ينتظر الموافقة. امنعه من الدخول.
        await supabase.auth.signOut();
        toast.error("حسابك قيد المراجعة حاليًا. لا يمكنك تسجيل الدخول.");
        return { error: new Error('ACCOUNT_PENDING_APPROVAL') };
      }
      
      // جلب الملف الشخصي للمستخدم بعد تسجيل الدخول مباشرة
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile post-login:', profileError);
        // لا يزال تسجيل الدخول ناجحًا، لكن الملف الشخصي فشل في التحميل
        // يمكنك إرجاع خطأ أو التعامل معه برشاقة
        toast.info('تم تسجيل الدخول، ولكن حدث خطأ في تحميل بيانات الملف الشخصي.');
      }
      
      // إرجاع الملف الشخصي مع الاستجابة الناجحة
      return { error: null, userProfile: profile };
    } catch (error) {
      console.error('Sign in catch error:', error);
      toast.error('حدث خطأ غير متوقع أثناء تسجيل الدخول');
      return { error };
    }
  };

  const signOut = async () => {
    // فقط قم بتسجيل الخروج من Supabase.
    // المستمع onAuthStateChange سيتولى تلقائيًا مسح حالة المستخدم والجلسة والملف الشخصي.
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error from Supabase:', error);
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
    // لا تقم بأي عمليات توجيه هنا.
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      toast.success('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    userProfile,
    signUp,
    signIn,
    signOut,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
