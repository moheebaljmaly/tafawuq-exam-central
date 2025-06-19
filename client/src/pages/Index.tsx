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
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log('User is authenticated, checking profile...');
          
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
            } else if (userRole === 'teacher') {
              navigate('/teacher-dashboard');
            } else {
              navigate('/student-dashboard');
            }
          } else {
            console.log('No profile found, staying on home page');
          }
        } else {
          console.log('No authenticated session found, staying on home page');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // عرض شاشة التحميل أثناء فحص المصادقة
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">جاري التحقق من الجلسة...</p>
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
