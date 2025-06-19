import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // تسجيل الخروج من Supabase
        await supabase.auth.signOut();
        
        // مسح البيانات المحلية
        localStorage.clear();
        sessionStorage.clear();
        
        // إعادة تحميل الصفحة للعودة للصفحة الرئيسية
        window.location.href = "/";
      } catch (error) {
        console.error("Error during logout:", error);
        // في حالة فشل تسجيل الخروج، انتقل للصفحة الرئيسية
        window.location.href = "/";
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <p className="text-lg">جاري تسجيل الخروج...</p>
      </div>
    </div>
  );
};

export default Logout; 