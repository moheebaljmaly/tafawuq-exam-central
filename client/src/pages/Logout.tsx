import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const LogoutPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await signOut();
      toast.success("تم تسجيل الخروج بنجاح!");
      // استخدام replace يمنع المستخدم من العودة إلى صفحة تسجيل الخروج باستخدام زر "الخلف" في المتصفح
      navigate('/', { replace: true });
    };

    // تنفيذ تسجيل الخروج عند تحميل الصفحة
    performLogout();
  }, [signOut, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-xl text-gray-700">جاري تسجيل الخروج...</p>
      </div>
    </div>
  );
};

export default LogoutPage; 