import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      // مسح البيانات المحلية أولاً
      localStorage.clear();
      sessionStorage.clear();
      
      try {
        // تسجيل الخروج من Supabase
        await supabase.auth.signOut();
      } catch (error) {
        console.error("Error during logout:", error);
      } finally {
        // العودة للصفحة الرئيسية في جميع الأحوال
        window.location.replace("/");
      }
    };

    // تنفيذ تسجيل الخروج فوراً
    handleLogout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <p className="text-lg">جاري تسجيل الخروج...</p>
      </div>
    </div>
  );
};

export default Logout; 