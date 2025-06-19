import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        if (error) {
          console.error("Error fetching user count:", error);
          return;
        }
        if (count !== null) {
          setUserCount(count);
        }
      } catch (error) {
        console.error("Unexpected error fetching user count:", error);
      }
    };

    fetchUserCount();
  }, []);

  // تحقق من وجود جلسة مصادقة عند تحميل الصفحة
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true);
        
        // إعطاء وقت قصير للتحقق من الجلسة
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));
        const sessionPromise = supabase.auth.getSession();
        
        // استخدام Promise.race للحد من وقت الانتظار
        const results = await Promise.allSettled([sessionPromise, timeoutPromise]);
        
        if (results[0].status === 'fulfilled') {
          const { data } = results[0].value;
          
          if (data.session) {
            console.log('User is authenticated, checking profile...');
            
            try {
              // الحصول على بيانات المستخدم من قاعدة البيانات
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.session.user.id)
                .single();
              
              if (profile) {
                const userRole = profile.role;
                console.log('User role:', userRole);
                
                // التوجيه حسب الدور
                if (userRole === 'admin') {
                  navigate('/admin-dashboard');
                  return;
                } else if (userRole === 'teacher') {
                  navigate('/teacher-dashboard');
                  return;
                } else {
                  navigate('/student-dashboard');
                  return;
                }
              }
            } catch (profileError) {
              console.log('Error fetching profile, staying on home page');
            }
          }
        }
        
        console.log('No authenticated session found, staying on home page');
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        // التأكد من إنهاء حالة التحقق
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // عرض شاشة التحميل لفترة قصيرة فقط
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">جاري التحقق...</p>
        </div>
      </div>
    );
  }

  // عرض محتوى الصفحة الرئيسية
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection userCount={userCount} />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
