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
          console.log('User is authenticated, redirecting to dashboard');
          
          // تحقق من دور المستخدم للتوجيه الصحيح
          const userRole = data.session.user?.user_metadata?.role || 'student';
          
          // استخدام navigate بدلاً من window.location.replace لتجربة مستخدم أفضل
          if (userRole === 'admin') {
            navigate('/admin-dashboard');
          } else if (userRole === 'teacher') {
            console.log('Redirecting teacher to teacher dashboard');
            navigate('/teacher-dashboard');
          } else {
            console.log('Redirecting student to student dashboard');
            navigate('/student-dashboard');
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

  // عرض محتوى الصفحة الرئيسية دائمًا، والتوجيه سيتم من خلال useEffect إذا كان المستخدم مصادقًا
  return (
    <div className="min-h-screen">
      <Header />
      {!isCheckingAuth && (
        <>
          <HeroSection userCount={userCount} />
          <FeaturesSection />
          <TestimonialsSection />
          <PricingSection />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Index;
