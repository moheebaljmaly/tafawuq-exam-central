import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'teacher' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading, userProfile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
        <p className="mr-4 text-gray-600">جاري التحقق...</p>
      </div>
    );
  }

  if (!user) {
    // إذا لم يكن المستخدم مسجلاً، قم بتوجيهه إلى صفحة تسجيل الدخول
    return <Navigate to="/login" replace />;
  }

  // إذا كان هناك دور مطلوب والملف الشخصي للمستخدم تم تحميله
  if (requiredRole && userProfile) {
    const userRole = userProfile.role;
    if (userRole !== requiredRole) {
      // إذا كان الدور غير متطابق، قم بتوجيهه إلى لوحة التحكم الخاصة به
      console.warn(`Access denied. User role '${userRole}' does not match required role '${requiredRole}'. Redirecting...`);
      if (userRole === 'student') {
        return <Navigate to="/student-dashboard" replace />;
      }
      if (userRole === 'teacher') {
        return <Navigate to="/teacher-dashboard" replace />;
      }
      // كحل بديل، توجيه إلى الصفحة الرئيسية
      return <Navigate to="/" replace />;
    }
  }

  // إذا كان المستخدم مسجلاً والدور متطابق (أو لا يوجد دور مطلوب)، اسمح بالوصول
  return <>{children}</>;
};

export default ProtectedRoute;
